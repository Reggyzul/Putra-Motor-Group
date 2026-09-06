import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nmmajxrcbojvabkrnatu.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tbWFqeHJjYm9qdmFia3JuYXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2OTA4NjUsImV4cCI6MjEwNDI2Njg2NX0.wVZVONHtEUJ8AOQVJ7xaRAHsFf9wJEtXHUl1fGwsuO0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectStorage() {
  console.log('--- Inspecting Buckets ---');
  const { data: buckets, error: bError } = await supabase.storage.listBuckets();
  if (bError) {
    console.error('Error listing buckets:', bError);
  } else {
    console.log('Buckets found:', buckets.map(b => ({ id: b.id, name: b.name, public: b.public })));
  }

  // Also check direct list on pandu-motor-images
  console.log('\n--- Checking bucket "pandu-motor-images" ---');
  const { data: files, error: fError } = await supabase.storage.from('pandu-motor-images').list('', { limit: 100 });
  if (fError) {
    console.error('Error listing root of pandu-motor-images:', fError);
  } else {
    console.log('Items in root:', files);
  }

  // Check 'uploads' folder
  const { data: uploadFiles, error: uError } = await supabase.storage.from('pandu-motor-images').list('uploads', { limit: 100 });
  if (uError) {
    console.error('Error listing uploads in pandu-motor-images:', uError);
  } else {
    console.log('Items in uploads folder count:', uploadFiles?.length);
    let totalSize = 0;
    uploadFiles?.forEach(f => {
      if (f.metadata?.size) totalSize += f.metadata.size;
    });
    console.log(`Total size in uploads: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`);
    if (uploadFiles && uploadFiles.length > 0) {
      console.log('Sample files:', uploadFiles.slice(0, 5));
    }
  }

  // Also check database tables for image URLs
  console.log('\n--- Checking Database Image URLs ---');
  const { data: vehicles } = await supabase.from('vehicles').select('id, name, image, images');
  console.log(`Vehicles count: ${vehicles?.length}`);
  let vehicleImagesCount = 0;
  vehicles?.forEach(v => {
    if (v.image) vehicleImagesCount++;
    if (v.images && Array.isArray(v.images)) vehicleImagesCount += v.images.length;
  });
  console.log(`Total vehicle image references: ${vehicleImagesCount}`);
  if (vehicles && vehicles.length > 0) {
    console.log('Vehicle 0 image:', vehicles[0].image);
    console.log('Vehicle 0 images:', vehicles[0].images);
  }

  const { data: banners } = await supabase.from('hero_banners').select('*');
  console.log(`Banners count: ${banners?.length}`);
  if (banners && banners.length > 0) {
    console.log('Banner 0:', banners[0]);
  }
}

inspectStorage().catch(console.error);
