const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data: beaches, error: beachesError } = await supabase.from('beaches').select('*');
  if (beachesError) console.error(beachesError);
  
  const { data: conditions, error: conditionsError } = await supabase.from('conditions').select('*');
  if (conditionsError) console.error(conditionsError);

  console.log("Beaches:", beaches);
  console.log("Conditions:", conditions);
}
run();
