import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...vals] = trimmed.split('=');
      if (key && vals.length > 0) {
        process.env[key.trim()] = vals.join('=').trim();
      }
    }
  });
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://nmmajxrcbojvabkrnatu.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tbWFqeHJjYm9qdmFia3JuYXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2OTA4NjUsImV4cCI6MjEwNDI2Njg2NX0.wVZVONHtEUJ8AOQVJ7xaRAHsFf9wJEtXHUl1fGwsuO0';

export async function pingSupabase() {
  const startTime = Date.now();
  console.log('====================================================');
  console.log('🚀 MEMULAI PING KEEP-ALIVE SUPABASE PANDU MOTOR GROUP');
  console.log(`⏰ Waktu: ${new Date().toISOString()}`);
  console.log(`🌐 Target: ${SUPABASE_URL}`);
  console.log('----------------------------------------------------');

  try {
    const cleanUrl = SUPABASE_URL.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
    const endpoint = `${cleanUrl}/rest/v1/site_settings?select=key&limit=1`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });

    const elapsed = Date.now() - startTime;
    if (response.ok) {
      console.log(`✅ Status: ${response.status} ${response.statusText} (Sukses)`);
      console.log(`⚡ Latensi: ${elapsed}ms`);
      console.log('🎉 Supabase Free Project aktif & counter 7 hari berhasil di-reset!');
      console.log('====================================================');
      return { success: true, status: response.status, latency: elapsed };
    } else {
      console.warn(`⚠️ Respons Supabase: ${response.status} ${response.statusText}`);
      return { success: false, status: response.status, latency: elapsed };
    }
  } catch (error) {
    console.error('❌ Gagal menghubungi Supabase:', error.message);
    return { success: false, error: error.message };
  }
}

// Auto-run when called directly from CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  pingSupabase();
}
