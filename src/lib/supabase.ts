import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://buvlwphnwaqrcsuravot.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1dmx3cGhud2FxcmNzdXJhdm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwNTcxMDIsImV4cCI6MjEwMzYzMzEwMn0.8264FnnUes_a6m9lo8EtQBeVd9KWJUb5nPCCrDi_U-c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 20,
    },
  },
});

// Dedicated Global Realtime Broadcast Channel for instant (<100ms) sync across all IPs & devices
export const globalSyncChannel = supabase.channel('pmg-global-live-sync', {
  config: {
    broadcast: { ack: true, self: false },
  },
});

export async function broadcastRemoteSync(entity: string = 'all') {
  try {
    await globalSyncChannel.send({
      type: 'broadcast',
      event: 'PMG_DATA_CHANGED',
      payload: { entity, timestamp: Date.now() },
    });
  } catch (err) {
    console.warn('Supabase remote broadcast warning:', err);
  }
}

/**
 * Keep-Alive ping function to prevent Supabase free project from pausing after 7 days of inactivity.
 */
export async function pingSupabaseKeepAlive(): Promise<{ success: boolean; timestamp: string; message: string }> {
  const timestamp = new Date().toISOString();
  try {
    // Lightweight query to refresh activity counter
    const { error } = await supabase.from('site_settings').select('key').limit(1);
    
    // Save last keep-alive ping timestamp locally
    localStorage.setItem('supabase_last_keepalive', timestamp);
    
    if (error && error.code !== 'PGRST116') {
      return { 
        success: true, 
        timestamp, 
        message: `Keep-alive ping terkirim ke Supabase REST API (${timestamp})` 
      };
    }
    return { 
      success: true, 
      timestamp, 
      message: `Supabase aktif & terhubung normal (${timestamp})` 
    };
  } catch (err: any) {
    return { 
      success: false, 
      timestamp, 
      message: err.message || 'Gagal mengirim ping keep-alive' 
    };
  }
}

/**
 * Helper to compress images on client side to prevent huge payload rejection (>2MB)
 */
async function compressImageFile(file: File, maxWidth = 1600, maxHeight = 1200, quality = 0.85): Promise<Blob | File> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }
  return new Promise((resolve) => {
    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          if (width / maxWidth > height / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            resolve(blob || file);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      };
      img.src = objectUrl;
    } catch {
      resolve(file);
    }
  });
}

/**
 * Upload an image or video media file to Supabase Storage.
 * 
 * CRITICAL: This function NEVER falls back to Base64 encoding.
 * Storing Base64 images directly in the database causes massive row sizes
 * that lead to PostgreSQL statement timeouts (504) on all other devices.
 * 
 * If bucket does not exist, it auto-creates it with public access.
 * If upload fails for any reason, throws an error so the UI can show a message.
 */
export async function uploadMediaFile(
  file: File,
  bucket = 'pandu-motor-images',
  folder = 'uploads'
): Promise<string> {
  const isImage = file.type.startsWith('image/');

  // Compress image before upload (max 1200x900, 80% quality → ~100-200KB)
  const fileToUpload = isImage ? await compressImageFile(file, 1200, 900, 0.80) : file;
  const fileExt = isImage ? 'jpg' : (file.name.split('.').pop() || 'mp4');
  const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

  // Attempt 1: Try uploading to existing bucket
  let uploadError: any = null;
  let uploadData: any = null;

  try {
    const res = await supabase.storage
      .from(bucket)
      .upload(fileName, fileToUpload, {
        cacheControl: '86400',
        upsert: true,
        contentType: isImage ? 'image/jpeg' : (file.type || 'application/octet-stream'),
      });
    uploadData = res.data;
    uploadError = res.error;
  } catch (e) {
    uploadError = e;
  }

  // Attempt 2: If bucket not found, create it and retry
  if (uploadError && (String(uploadError?.message || '').includes('Bucket not found') || String(uploadError?.error || '').includes('Bucket not found') || uploadError?.statusCode === 400)) {
    try {
      // Create public bucket
      await supabase.storage.createBucket(bucket, { public: true, fileSizeLimit: 10485760 });
      const res = await supabase.storage
        .from(bucket)
        .upload(fileName, fileToUpload, {
          cacheControl: '86400',
          upsert: true,
          contentType: isImage ? 'image/jpeg' : (file.type || 'application/octet-stream'),
        });
      uploadData = res.data;
      uploadError = res.error;
    } catch (e) {
      uploadError = e;
    }
  }

  if (uploadData && !uploadError) {
    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(uploadData.path);
    return publicUrlData.publicUrl;
  }

  // IMPORTANT: Do NOT fall back to Base64. Base64 stored in DB causes 504 timeouts on all devices.
  // Instead, throw so the UI shows a clear error message to the admin.
  const errMsg = uploadError?.message || uploadError?.error || String(uploadError) || 'Upload gagal';
  throw new Error(`Gagal upload ke Supabase Storage: ${errMsg}. Pastikan bucket "${bucket}" sudah dibuat di Supabase Dashboard → Storage.`);
}

export const uploadImageFile = uploadMediaFile;
