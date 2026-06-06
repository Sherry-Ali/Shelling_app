# NOAA Data Ingestion Workflow

## Goal
Fetch the latest environmental conditions (wind, waves, water temperature) and tide predictions (high/low tides) from NOAA for Florida beaches and update the Supabase database.

## Inputs
- `beaches` table from Supabase containing `id`, `noaa_station_id`, `latitude`, `longitude`.
- Supabase API URL and Service Role Key (for inserting data).

## Outputs
- New rows in the `conditions` table.
- New rows in the `tide_forecasts` table.

## Tools
- `tools/fetch_noaa.py`: A Python script that:
  1. Queries Supabase to get all beaches.
  2. For each beach, queries the NOAA CO-OPS API for tide predictions and the NDBC API for weather/wave conditions.
  3. Computes the shelling score and clarity score (using placeholder logic if formulas are incomplete).
  4. Upserts/Inserts the data into Supabase.

## NOAA Endpoints
- **Tide Predictions**: `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter`
  - Params: `station`, `date=today`, `product=predictions`, `datum=MLLW`, `time_zone=gmt`, `units=english`, `format=json`, `interval=hilo`.
- **Wind/Wave Conditions**: Use NDBC latest observations (e.g., `https://www.ndbc.noaa.gov/data/latest_obs/latest_obs.txt`) or station specific URLs.

## Error Handling
- If a station is down or returns missing data, fall back to the last known conditions or insert NULL for missing fields.
- Continue processing other beaches even if one fails.

## Next Steps for API Route
Once the Python tool proves successful and deterministic, its core logic will be ported into a Next.js API route (`/api/cron/noaa`) to run natively on Vercel Cron.
