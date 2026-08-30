import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://buvlwphnwaqrcsuravot.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1dmx3cGhud2FxcmNzdXJhdm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwNTcxMDIsImV4cCI6MjEwMzYzMzEwMn0.8264FnnUes_a6m9lo8EtQBeVd9KWJUb5nPCCrDi_U-c';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Testing Supabase Connection...');
  
  const tables = ['vehicles', 'branches', 'hero_banners', 'site_settings', 'announcements'];
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('*');
    if (error) {
      console.log(`Table '${t}': ERROR ->`, error.message, `(Code: ${error.code})`);
    } else {
      console.log(`Table '${t}': OK -> ${data.length} rows found.`);
    }
  }
}

test();
