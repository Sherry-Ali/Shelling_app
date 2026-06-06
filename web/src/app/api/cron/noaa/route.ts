import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// We should use a service role key for cron jobs to bypass RLS for inserts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchJson(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }
  return response.json();
}

async function getTidePredictions(stationId: string) {
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const url = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?station=${stationId}&begin_date=${today}&end_date=${today}&product=predictions&datum=MLLW&time_zone=gmt&units=english&format=json&interval=hilo`;
  
  try {
    const data = await fetchJson(url);
    if (data.predictions) {
      return data.predictions.map((p: any) => ({
        time: p.t,
        level: parseFloat(p.v),
        type: p.type // 'H' or 'L'
      }));
    }
  } catch (err) {
    console.error(`Error fetching tide predictions for station ${stationId}:`, err);
  }
  return [];
}

export async function GET(request: Request) {
  // Check authorization header if using Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // 1. Get all beaches with a NOAA station ID
    const { data: beaches, error: beachesError } = await supabase
      .from('beaches')
      .select('id, noaa_station_id');

    if (beachesError) throw beachesError;
    
    const beachesWithStation = beaches?.filter(b => b.noaa_station_id !== null) || [];

    let processedCount = 0;

    // 2. Fetch data for each beach
    for (const beach of beachesWithStation) {
      const predictions = await getTidePredictions(beach.noaa_station_id);

      if (predictions.length > 0) {
        // Insert tide forecasts
        const forecastInserts = predictions.map((p: any) => ({
          beach_id: beach.id,
          prediction_time: `${p.time}:00Z`, // Format properly for timestamp
          water_level: p.level,
          type: p.type
        }));

        // First delete any existing forecasts for this beach (to avoid duplicates)
        await supabase
          .from('tide_forecasts')
          .delete()
          .eq('beach_id', beach.id);

        // Then insert the fresh forecasts
        const { error: insertError } = await supabase
          .from('tide_forecasts')
          .insert(forecastInserts);

        if (insertError) {
           console.error('Error inserting forecasts for beach:', beach.id, insertError);
        }
      }
      processedCount++;
    }

    return NextResponse.json({ 
      success: true, 
      processed_beaches: processedCount,
      debug: {
        total_beaches_in_db: beaches?.length || 0,
        beaches_with_station_id: beachesWithStation.length,
        used_service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    });
  } catch (error: any) {
    console.error('Cron job failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
