const https = require('https');

// Example station ID for Naples, FL (tide station)
const STATION_ID = '8725110';

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function getTidePredictions(stationId) {
  console.log(`Fetching tide predictions for station ${stationId}...`);
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
  
  const url = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?station=${stationId}&begin_date=${today}&end_date=${today}&product=predictions&datum=MLLW&time_zone=gmt&units=english&format=json&interval=hilo`;

  try {
    const data = await fetchJson(url);
    if (data.predictions) {
      console.log('Tide Predictions:');
      data.predictions.forEach(p => {
        console.log(`Time: ${p.t}, Level: ${p.v} ft, Type: ${p.type === 'H' ? 'High' : 'Low'}`);
      });
    } else {
      console.log('No predictions found:', data);
    }
  } catch (err) {
    console.error('Error fetching tide predictions:', err);
  }
}

getTidePredictions(STATION_ID);
