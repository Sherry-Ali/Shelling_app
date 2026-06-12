-- Florida Shell Finder Schema & Seed Data

-- 1. Create Tables
CREATE TABLE shells (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  common_name VARCHAR(255),
  size_range VARCHAR(100),
  habitat VARCHAR(255),
  seasonality VARCHAR(255),
  rarity VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE beaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  county VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  access_info TEXT,
  noaa_station_id VARCHAR(50),
  beach_facing VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE beach_shell_likelihood (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beach_id UUID REFERENCES beaches(id) ON DELETE CASCADE,
  shell_id UUID REFERENCES shells(id) ON DELETE CASCADE,
  likelihood_score INTEGER CHECK (likelihood_score >= 1 AND likelihood_score <= 5),
  UNIQUE(beach_id, shell_id)
);

CREATE TABLE conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beach_id UUID REFERENCES beaches(id) ON DELETE CASCADE,
  wind_speed DECIMAL,
  wind_direction VARCHAR(50),
  wave_height DECIMAL,
  tide_level DECIMAL,
  water_temp DECIMAL,
  clarity_score INTEGER,
  shelling_score INTEGER,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Insert Dummy Data
-- Beaches
INSERT INTO beaches (id, name, county, latitude, longitude, access_info, beach_facing) VALUES
('b1111111-1111-1111-1111-111111111111', 'Sanibel Island (Blind Pass)', 'Lee', 26.4831, -82.1818, 'Public parking available, fills up early.', 'SW'),
('b2222222-2222-2222-2222-222222222222', 'Captiva Island', 'Lee', 26.5245, -82.1906, 'Limited parking, great sunset views.', 'W'),
('b3333333-3333-3333-3333-333333333333', 'Venice Beach', 'Sarasota', 27.0988, -82.4578, 'Shark tooth capital, free parking.', 'W'),
('b4444444-4444-4444-4444-444444444444', 'Honeymoon Island', 'Pinellas', 28.0638, -82.8286, 'State park fee required. Walk to north end for shells.', 'W');

-- Shells
INSERT INTO shells (id, name, common_name, size_range, habitat, rarity, description) VALUES
('c1111111-1111-1111-1111-111111111111', 'Junonia', 'Junonia', '2-5 inches', 'Deep water', 'Very Rare', 'The holy grail of Florida shelling. Creamy white with brown spots.'),
('c2222222-2222-2222-2222-222222222222', 'Lightning Whelk', 'Lightning Whelk', '2-16 inches', 'Sandy bottoms', 'Common', 'Left-handed spiral shell, often found in shallow water.'),
('c3333333-3333-3333-3333-333333333333', 'Fasciolaria tulipa', 'True Tulip', '2-6 inches', 'Grass beds', 'Uncommon', 'Smooth shell with interrupted spiral lines of brown or dark reddish-brown.'),
('c4444444-4444-4444-4444-444444444444', 'Carcharodon carcharias teeth', 'Shark Tooth (Fossil)', '0.5-3 inches', 'Fossil beds offshore', 'Common (Venice)', 'Not a shell, but highly sought after in specific regions like Venice.');

-- Likelihood
INSERT INTO beach_shell_likelihood (beach_id, shell_id, likelihood_score) VALUES
('b1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 2), -- Junonia at Sanibel
('b1111111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222', 5), -- Lightning Whelk at Sanibel
('b2222222-2222-2222-2222-222222222222', 'c3333333-3333-3333-3333-333333333333', 4), -- Tulip at Captiva
('b3333333-3333-3333-3333-333333333333', 'c4444444-4444-4444-4444-444444444444', 5), -- Shark tooth at Venice
('b4444444-4444-4444-4444-444444444444', 'c2222222-2222-2222-2222-222222222222', 3); -- Whelk at Honeymoon

-- Current Conditions (Dummy data for today)
INSERT INTO conditions (beach_id, wind_speed, wind_direction, wave_height, tide_level, clarity_score, shelling_score) VALUES
('b1111111-1111-1111-1111-111111111111', 12.5, 'NW', 2.1, -0.5, 80, 92), -- Excellent shelling
('b2222222-2222-2222-2222-222222222222', 15.0, 'NW', 3.0, 0.0, 70, 85),  -- Good shelling
('b3333333-3333-3333-3333-333333333333', 8.0, 'W', 1.0, 1.2, 95, 60),   -- Fair shelling
('b4444444-4444-4444-4444-444444444444', 5.5, 'E', 0.5, 2.0, 100, 40);  -- Poor shelling
