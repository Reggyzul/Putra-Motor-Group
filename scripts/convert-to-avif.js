import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.resolve(__dirname, '../public/images');

async function convertImages() {
  if (!fs.existsSync(imagesDir)) {
    console.error('Images directory does not exist:', imagesDir);
    return;
  }

  const files = fs.readdirSync(imagesDir);
  console.log(`Found ${files.length} files in public/images/`);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
      const baseName = path.basename(file, ext);
      const inputPath = path.join(imagesDir, file);
      const outputPath = path.join(imagesDir, `${baseName}.avif`);

      try {
        const inputStats = fs.statSync(inputPath);
        await sharp(inputPath)
          .avif({ quality: 80, effort: 6 })
          .toFile(outputPath);

        const outputStats = fs.statSync(outputPath);
        const savings = (((inputStats.size - outputStats.size) / inputStats.size) * 100).toFixed(1);
        console.log(`✅ Converted "${file}" -> "${baseName}.avif" (${(inputStats.size/1024).toFixed(1)}KB -> ${(outputStats.size/1024).toFixed(1)}KB, -${savings}%)`);
      } catch (err) {
        console.error(`❌ Failed to convert "${file}":`, err.message);
      }
    }
  }

  console.log('\n🎉 All images successfully converted to AVIF format!');
}

convertImages();
