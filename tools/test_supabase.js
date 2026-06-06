require('dotenv').config({ path: './web/.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBeaches() {
  console.log("Checking beaches...");
  const { data, error } = await supabase.from('beaches').select('id, name, noaa_station_id');
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Beaches:", data);
  }
}

checkBeaches();
