-- Update existing beaches with NOAA station IDs for tide predictions

-- Sanibel Island (Blind Pass) -> Naples (closest major station with tide predictions)
UPDATE beaches SET noaa_station_id = '8725110' WHERE name LIKE 'Sanibel Island%';

-- Captiva Island -> Naples
UPDATE beaches SET noaa_station_id = '8725110' WHERE name LIKE 'Captiva Island%';

-- Venice Beach -> Port Manatee (closest)
UPDATE beaches SET noaa_station_id = '8726384' WHERE name LIKE 'Venice Beach%';

-- Honeymoon Island -> Clearwater Beach
UPDATE beaches SET noaa_station_id = '8726724' WHERE name LIKE 'Honeymoon Island%';
