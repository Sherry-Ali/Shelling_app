const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase.from('shells').select('*');
  if (error) {
    console.error('ERROR:', JSON.stringify(error, null, 2));
    console.error('ERROR RAW:', error);
  } else {
    console.log('SUCCESS:', data);
  }
}
run();
