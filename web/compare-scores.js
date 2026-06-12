const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data: beaches } = await supabase.from('beaches').select('*');
  const treasureIsland = beaches.find(b => b.name.includes('Treasure Island'));
  const melbourne = beaches.find(b => b.name.includes('Melbourne'));
  
  const { data: conditions } = await supabase.from('conditions').select('*');
  
  if (treasureIsland) {
      const tiConditions = conditions.find(c => c.beach_id === treasureIsland.id);
      console.log('Treasure Island (', treasureIsland.beach_facing, 'facing ):', tiConditions);
  } else {
      console.log('Treasure Island not found in DB.');
  }

  if (melbourne) {
      const mConditions = conditions.find(c => c.beach_id === melbourne.id);
      console.log('Melbourne (', melbourne.beach_facing, 'facing ):', mConditions);
  } else {
      console.log('Melbourne not found in DB.');
  }
}
run();
