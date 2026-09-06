/**
 * Bulk Image Optimizer for Supabase Storage
 * Mengompresi semua gambar di bucket Supabase ke WebP/JPEG teroptimasi
 * Mengurangi ukuran file hingga 80-90% dan menghemat kuota Egress Supabase.
 */

import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Konfigurasi Supabase
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://buvlwphnwaqrcsuravot.supabase.co';
// Gunakan SERVICE_ROLE_KEY jika ada, atau ANON_KEY
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1dmx3cGhud2FxcmNzdXJhdm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwNTcxMDIsImV4cCI6MjEwMzYzMzEwMn0.8264FnnUes_a6m9lo8EtQBeVd9KWJUb5nPCCrDi_U-c';

const BUCKET_NAME = 'pandu-motor-images';
const FOLDERS = ['vehicles', 'banners', 'branches', 'logos', 'announcements', 'services', 'uploads', ''];
const MAX_WIDTH = 1000;
const MAX_HEIGHT = 800;
const QUALITY = 75;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const tempDir = path.resolve(__dirname, '../temp_images');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

async function listAllFiles(folder = 'uploads') {
  console.log(`🔍 Memindai folder "${folder || 'root'}" di bucket "${BUCKET_NAME}"...`);
  const { data, error } = await supabase.storage.from(BUCKET_NAME).list(folder, {
    limit: 500,
    sortBy: { column: 'name', order: 'asc' },
  });

  if (error) {
    throw error;
  }

  return (data || []).filter(item => item.id !== null && !item.name.endsWith('/'));
}

async function optimizeAndReplaceImage(folder, fileName) {
  const fullPath = `${folder}/${fileName}`;
  const localOriginal = path.join(tempDir, `orig_${fileName}`);
  const localOptimized = path.join(tempDir, `opt_${fileName}`);

  try {
    // 1. Download file dari Supabase
    const { data: blob, error: dlError } = await supabase.storage
      .from(BUCKET_NAME)
      .download(fullPath);

    if (dlError) {
      console.error(`❌ Gagal download ${fullPath}:`, dlError.message);
      return;
    }

    const arrayBuffer = await blob.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);
    const originalSize = inputBuffer.length;

    // 2. Kompres menggunakan sharp
    const isPng = fileName.toLowerCase().endsWith('.png');
    let pipeline = sharp(inputBuffer)
      .resize(MAX_WIDTH, MAX_HEIGHT, { fit: 'inside', withoutEnlargement: true });

    if (isPng) {
      pipeline = pipeline.png({ quality: QUALITY, compressionLevel: 8 });
    } else {
      pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true });
    }

    const outputBuffer = await pipeline.toBuffer();
    const newSize = outputBuffer.length;

    const diff = originalSize - newSize;
    const percent = ((diff / originalSize) * 100).toFixed(1);

    if (newSize >= originalSize) {
      console.log(`ℹ️ [SKIP] ${fileName}: Sudah optimal (${(originalSize / 1024).toFixed(1)} KB)`);
      return;
    }

    // 3. Upload kembali dan timpa (overwrite / upsert)
    const { error: upError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fullPath, outputBuffer, {
        upsert: true,
        cacheControl: '31536000, immutable', // Cache 1 tahun di browser pengunjung
        contentType: isPng ? 'image/png' : 'image/jpeg',
      });

    if (upError) {
      console.error(`❌ Gagal re-upload ${fullPath}:`, upError.message);
      return;
    }

    console.log(`✅ [BERHASIL] ${fileName}: ${(originalSize / 1024).toFixed(1)} KB ➔ ${(newSize / 1024).toFixed(1)} KB (Hemat ${percent}% / ${(diff / 1024).toFixed(1)} KB)`);
  } catch (err) {
    console.error(`❌ Error pada ${fileName}:`, err.message);
  } finally {
    // Bersihkan file sementara jika ada
    if (fs.existsSync(localOriginal)) fs.unlinkSync(localOriginal);
    if (fs.existsSync(localOptimized)) fs.unlinkSync(localOptimized);
  }
}

async function run() {
  console.log('==================================================');
  console.log('🚀 SUPABASE STORAGE BATCH IMAGE OPTIMIZER');
  console.log('Target Bucket:', BUCKET_NAME);
  console.log('Folders:', FOLDERS.join(', '));
  console.log('Max Dimensi:', `${MAX_WIDTH}x${MAX_HEIGHT}px`);
  console.log('Target Quality:', `${QUALITY}%`);
  console.log('==================================================\n');

  let grandTotalOriginal = 0;
  let grandTotalNew = 0;
  let totalOptimizedCount = 0;

  try {
    for (const folder of FOLDERS) {
      const folderLabel = folder || '(root)';
      console.log(`\n📂 Memeriksa folder: ${folderLabel}...`);
      let files = [];
      try {
        files = await listAllFiles(folder);
      } catch (e) {
        console.warn(`⚠️ Gagal memindai folder "${folderLabel}":`, e.message);
        continue;
      }

      console.log(`Ditemukan ${files.length} file di ${folderLabel}.`);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = path.extname(file.name).toLowerCase();
        if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
          continue;
        }
        console.log(`[${i + 1}/${files.length}] Memproses ${folderLabel}/${file.name}...`);
        await optimizeAndReplaceImage(folder, file.name);
      }
    }

    console.log('\n🎉 Selesai memindai seluruh folder di Supabase Storage.');
  } catch (err) {
    console.error('\n🚨 Terjadi kesalahan:', err.message);
    if (err.message && err.message.includes('exceed_egress_quota')) {
      console.error('\n⚠️ CATATAN PENTING:');
      console.error('Proyek Supabase Anda saat ini terkunci karena melebihi kuota bandwidth (egress).');
      console.error('Buka dashboard Supabase (Billing/Usage) untuk membuka kunci, atau gunakan SERVICE_ROLE_KEY.');
    }
  } finally {
    if (fs.existsSync(tempDir)) {
      try {
        fs.rmdirSync(tempDir);
      } catch {}
    }
  }
}

run();
