import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper to convert meters to feet
const mToFt = (m: number) => (m * 3.28084).toFixed(1);

// Helper to calculate shelling score
function calculateShellingScore(windMph: number, waveFt: number): number {
  let score = 50; // Base score
  
  // Stronger winds = better shells washing up
  if (windMph > 15) score += 20;
  else if (windMph > 10) score += 10;
  else if (windMph < 5) score -= 10;

  // Larger waves bring more shells
  if (waveFt > 3) score += 20;
  else if (waveFt > 2) score += 10;
  else if (waveFt < 1) score -= 10;

  // Cap between 0 and 100
  return Math.min(Math.max(score, 0), 100);
}

export async function GET(request: Request) {
  // 1. Authenticate the cron job
  const authHeader = request.headers.get('authorization');
  if (
    process.env.CRON_SECRET && 
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Fetch all beaches
    const { data: beaches, error: beachesError } = await supabase.from('beaches').select('*');
    
    if (beachesError || !beaches) {
      throw new Error('Failed to fetch beaches');
    }

    const results = [];

    // 3. Loop through beaches and fetch live data
    for (const beach of beaches) {
      console.log(`Updating conditions for ${beach.name}...`);
      
      // Fallback NOAA station IDs if missing
      let stationId = beach.noaa_station_id;
      if (!stationId) {
        if (beach.name.includes('Sanibel') || beach.name.includes('Captiva')) stationId = '8725520'; // Fort Myers
        else if (beach.name.includes('Venice')) stationId = '8725836'; // Venice
        else if (beach.name.includes('Honeymoon')) stationId = '8726724'; // Clearwater
        else stationId = '8726520'; // St. Pete fallback
      }

      // --- FETCH NOAA TIDES ---
      let tidePredictions = [];
      try {
        const noaaRes = await fetch(
          `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=today&station=${stationId}&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=hilo&units=english&format=json`
        );
        const noaaData = await noaaRes.json();
        tidePredictions = noaaData.predictions || [];
      } catch (e) {
        console.error(`NOAA fetch failed for ${beach.name}:`, e);
      }

      // --- FETCH OPEN-METEO WEATHER (Wind) ---
      let windSpeed = 0;
      let windDir = 'N';
      try {
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${beach.latitude}&longitude=${beach.longitude}&current=wind_speed_10m,wind_direction_10m&wind_speed_unit=mph`
        );
        const weatherData = await weatherRes.json();
        windSpeed = weatherData.current?.wind_speed_10m || 0;
        
        // Convert degrees to direction
        const deg = weatherData.current?.wind_direction_10m || 0;
        const dirs = ['N','NE','E','SE','S','SW','W','NW'];
        windDir = dirs[Math.round(deg / 45) % 8];
      } catch (e) {
        console.error(`Weather fetch failed for ${beach.name}:`, e);
      }

      // --- FETCH NOAA WATER TEMP ---
      let waterTempF = 0;
      try {
        const tempRes = await fetch(
          `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=latest&station=${stationId}&product=water_temperature&datum=MLLW&time_zone=lst_ldt&units=english&format=json`
        );
        const tempData = await tempRes.json();
        if (tempData.data && tempData.data.length > 0) {
          waterTempF = Math.round(parseFloat(tempData.data[0].v));
        }
      } catch (e) {
        console.error(`NOAA temp fetch failed for ${beach.name}:`, e);
      }

      // --- FETCH OPEN-METEO MARINE (Waves) ---
      let waveHeightFt = 0;
      try {
        const marineRes = await fetch(
          `https://marine-api.open-meteo.com/v1/marine?latitude=${beach.latitude}&longitude=${beach.longitude}&current=wave_height`
        );
        const marineData = await marineRes.json();
        
        // Convert metrics
        if (marineData.current?.wave_height) {
          waveHeightFt = parseFloat(mToFt(marineData.current.wave_height));
        }
      } catch (e) {
        console.error(`Marine fetch failed for ${beach.name}:`, e);
      }

      // --- CALCULATIONS ---
      const shellingScore = calculateShellingScore(windSpeed, waveHeightFt);
      // For current tide level, we just pick the first high/low of the day for the MVP summary
      const currentTideLvl = tidePredictions.length > 0 ? parseFloat(tidePredictions[0].v).toFixed(1) : 0;

      // --- UPDATE DATABASE ---
      
      // 1. Clear old conditions
      await supabase.from('conditions').delete().eq('beach_id', beach.id);

      // 2. Insert new condition
      const { error: condError } = await supabase.from('conditions').insert({
        beach_id: beach.id,
        wind_speed: windSpeed,
        wind_direction: windDir,
        wave_height: waveHeightFt,
        tide_level: currentTideLvl,
        water_temp: waterTempF,
        clarity_score: 80, // placeholder
        shelling_score: shellingScore
      });

      if (condError) console.error('Conditions Insert Error:', condError);

      // 2. Clear old tide forecasts and insert new ones
      await supabase.from('tide_forecasts').delete().eq('beach_id', beach.id);
      
      if (tidePredictions.length > 0) {
        const tideInserts = tidePredictions.map((t: any) => ({
          beach_id: beach.id,
          prediction_time: t.t, // format "YYYY-MM-DD HH:MM"
          water_level: parseFloat(t.v),
          type: t.type // 'H' or 'L'
        }));
        
        const { error: tideError } = await supabase.from('tide_forecasts').insert(tideInserts);
        if (tideError) console.error('Tide Insert Error:', tideError);
      }

      results.push({
        beach: beach.name,
        score: shellingScore,
        tides: tidePredictions.length
      });
    }

    return NextResponse.json({ success: true, updated: results });

  } catch (error: any) {
    console.error('Cron error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
