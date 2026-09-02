import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://buvlwphnwaqrcsuravot.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1dmx3cGhud2FxcmNzdXJhdm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwNTcxMDIsImV4cCI6MjEwMzYzMzEwMn0.8264FnnUes_a6m9lo8EtQBeVd9KWJUb5nPCCrDi_U-c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

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
 * Upload an image or video media file to Supabase Storage or return base64 data URL
 */
export async function uploadMediaFile(
  file: File, 
  bucket = 'pandu-motor-images',
  folder = 'uploads'
): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    
    // Try uploading to Supabase Storage bucket
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || undefined,
      });

    if (!error && data) {
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);
      return publicUrlData.publicUrl;
    }
  } catch (e) {
    console.warn('Supabase storage upload fallback to base64 reader:', e);
  }

  // Fallback: Return Base64 data URL so media works 100% seamlessly offline & online
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export const uploadImageFile = uploadMediaFile;
