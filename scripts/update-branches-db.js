import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://buvlwphnwaqrcsuravot.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1dmx3cGhud2FxcmNzdXJhdm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwNTcxMDIsImV4cCI6MjEwMzYzMzEwMn0.8264FnnUes_a6m9lo8EtQBeVd9KWJUb5nPCCrDi_U-c';

const supabase = createClient(supabaseUrl, supabaseKey);

const updatedBranches = [
  {
    id: 'kisaran',
    phone: '0822-7647-7628',
    whatsapp: '6282276477628',
    google_maps_url: 'https://maps.app.goo.gl/TQbnnh9NAoyRbyBK8'
  },
  {
    id: 'perdagangan',
    phone: '0822-7783-9628',
    whatsapp: '6282277839628',
    google_maps_url: 'https://maps.app.goo.gl/mC3Sp6pWzSwYnMrP7?g_st=aw'
  },
  {
    id: 'cikampak',
    phone: '0812-6060-525',
    whatsapp: '628126060525',
    google_maps_url: 'https://maps.app.goo.gl/nzHjDtWnQitAaAKf6?g_st=aw'
  },
  {
    id: 'dumai',
    phone: '0812-7567-7474',
    whatsapp: '6281275677474',
    google_maps_url: 'https://maps.app.goo.gl/G16opnzCUJ98irnq9?g_st=aw'
  }
];

async function run() {
  console.log('Updating branch numbers in Supabase...');
  for (const b of updatedBranches) {
    const { data, error } = await supabase
      .from('branches')
      .update({
        phone: b.phone,
        whatsapp: b.whatsapp,
        google_maps_url: b.google_maps_url
      })
      .eq('id', b.id)
      .select();
    
    if (error) {
      console.log(`Failed to update ${b.id}:`, error.message);
    } else {
      console.log(`Successfully updated ${b.id}:`, data);
    }
  }
  console.log('Done!');
}

run();
