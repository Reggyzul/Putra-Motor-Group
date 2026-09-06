import { createClient } from '@supabase/supabase-js';

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nmmajxrcbojvabkrnatu.supabase.co';
const supabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tbWFqeHJjYm9qdmFia3JuYXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2OTA4NjUsImV4cCI6MjEwNDI2Njg2NX0.wVZVONHtEUJ8AOQVJ7xaRAHsFf9wJEtXHUl1fGwsuO0';

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
/**
 * Helper to compress images on client side to prevent huge payload rejection & save Supabase storage/egress
 * Uses WebP format (or JPEG fallback), max 1000x750px, quality 0.75 -> file size drops to ~30-60KB!
 */
async function compressImageFile(file: File, maxWidth = 1000, maxHeight = 750, quality = 0.75): Promise<{ blob: Blob; ext: string; mime: string }> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') {
    const ext = file.name.split('.').pop() || 'jpg';
    return { blob: file, ext, mime: file.type || 'image/jpeg' };
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
          resolve({ blob: file, ext: 'jpg', mime: 'image/jpeg' });
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first for 80-90% size reduction
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ blob, ext: 'webp', mime: 'image/webp' });
            } else {
              // Fallback to JPEG
              canvas.toBlob(
                (jpegBlob) => {
                  resolve({ blob: jpegBlob || file, ext: 'jpg', mime: 'image/jpeg' });
                },
                'image/jpeg',
                quality
              );
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve({ blob: file, ext: 'jpg', mime: 'image/jpeg' });
      };
      img.src = objectUrl;
    } catch {
      resolve({ blob: file, ext: 'jpg', mime: 'image/jpeg' });
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

  // Guardrail: Batasi file non-gambar (PDF, Dokumen) max 3 MB agar tidak memakan storage & egress Supabase
  if (!isImage && file.size > 3 * 1024 * 1024) {
    throw new Error(
      `File dokumen terlalu besar (${(file.size / (1024 * 1024)).toFixed(1)} MB). Batas upload dokumen ke Supabase adalah 3 MB untuk mencegah storage & egress membengkak. Silakan gunakan tautan Google Drive / link eksternal untuk file besar.`
    );
  }

  let fileToUpload: Blob | File = file;
  let fileExt = file.name.split('.').pop() || 'mp4';
  let mimeType = file.type || 'application/octet-stream';

  if (isImage) {
    const compressed = await compressImageFile(file, 1000, 750, 0.75);
    fileToUpload = compressed.blob;
    fileExt = compressed.ext;
    mimeType = compressed.mime;
  }

  const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

  // Attempt 1: Try uploading to existing bucket
  let uploadError: any = null;
  let uploadData: any = null;

  try {
    const res = await supabase.storage
      .from(bucket)
      .upload(fileName, fileToUpload, {
        cacheControl: '31536000, immutable', // Cache 1 tahun di browser agar kuota egress hemat
        upsert: true,
        contentType: mimeType,
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
          cacheControl: '31536000, immutable',
          upsert: true,
          contentType: mimeType,
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

  // Handle specific Supabase Storage errors
  const errMsg = uploadError?.message || uploadError?.error || String(uploadError) || 'Upload gagal';
  if (errMsg.includes('exceed_egress_quota') || uploadError?.statusCode === 402 || uploadError?.status === 402) {
    throw new Error('Supabase Storage terkunci: Melebihi kuota bandwidth (Egress Quota Exceeded). Buka Supabase Dashboard > Project Settings > Billing untuk memulihkan akses atau upgrade paket.');
  }

  if (errMsg.includes('row-level security') || errMsg.includes('row-level security policy') || uploadError?.statusCode === '403' || uploadError?.statusCode === 403) {
    throw new Error(`Akses upload Supabase Storage terkunci kebijakan RLS (${errMsg}). Solusi cepat: Buka menu "Status DB & Keep-Alive" di Admin Dashboard, lalu salin dan jalankan script "Storage RLS Fix" di Supabase SQL Editor.`);
  }

  // IMPORTANT: Do NOT fall back to Base64. Base64 stored in DB causes 504 timeouts on all devices.
  throw new Error(`Gagal upload ke Supabase Storage: ${errMsg}. Pastikan bucket "${bucket}" sudah dibuat dengan akses Public di Supabase Dashboard → Storage.`);
}

export const uploadImageFile = uploadMediaFile;
