import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...vals] = trimmed.split('=');
      if (key && vals.length > 0) {
        process.env[key.trim()] = vals.join('=').trim();
      }
    }
  });
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('====================================================');
console.log('🔍 VERIFIKASI KONEKSI SUPABASE PANDU MOTOR GROUP');
console.log('====================================================');
console.log(`URL Supabase: ${supabaseUrl}`);
console.log(`Anon Key    : ${supabaseKey ? supabaseKey.substring(0, 15) + '...' : 'TIDAK DITEMUKAN'}`);
console.log('----------------------------------------------------');

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project')) {
  console.error('❌ URL atau Key Supabase belum diatur dengan benar di .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  const tables = ['vehicles', 'branches', 'hero_banners', 'site_settings', 'announcements'];
  let allTablesOk = true;

  console.log('\n📊 MEMERIKSA TABEL DATABASE:');
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('count', { count: 'exact', head: true });
    if (error) {
      allTablesOk = false;
      console.log(`  ❌ Tabel "${table}": ERROR (${error.message || error.code})`);
    } else {
      console.log(`  ✅ Tabel "${table}": TERHUBUNG NORMAL`);
    }
  }

  console.log('\n🗄️ MEMERIKSA STORAGE BUCKET:');
  const { data: bucketData, error: bError } = await supabase.storage.from('pandu-motor-images').list('', { limit: 1 });
  if (bError) {
    console.log(`  ⚠️ Bucket "pandu-motor-images": ${bError.message}`);
    console.log('     (Jika belum dibuat, buat bucket "pandu-motor-images" dengan akses Public di Supabase Dashboard)');
  } else {
    console.log('  ✅ Bucket "pandu-motor-images": TERHUBUNG & SIAP DIGUNAKAN');
  }

  console.log('\n----------------------------------------------------');
  if (allTablesOk) {
    console.log('🎉 SEMUA TABEL SUPABASE LENGKAP & SIAP 100%!');
  } else {
    console.log('⚠️ Beberapa tabel belum dibuat.');
    console.log('👉 Solusi: Buka Supabase Dashboard > SQL Editor, lalu jalankan file "public/supabase_schema.sql".');
  }
  console.log('====================================================\n');
}

verify().catch(err => {
  console.error('Terjadi error saat verifikasi:', err);
});
