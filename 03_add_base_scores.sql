-- Add new columns to the beaches table for baseline scoring
ALTER TABLE beaches
ADD COLUMN base_clarity_score INTEGER DEFAULT 75,
ADD COLUMN base_shell_score INTEGER DEFAULT 75;

-- Update specific beaches with researched estimates
-- Sanibel and Captiva: Great shelling, good clarity
UPDATE beaches SET base_clarity_score = 70, base_shell_score = 95 WHERE name LIKE '%Sanibel%';
UPDATE beaches SET base_clarity_score = 75, base_shell_score = 90 WHERE name LIKE '%Captiva%';

-- Venice: Good shelling (shark teeth), okay clarity
UPDATE beaches SET base_clarity_score = 65, base_shell_score = 85 WHERE name LIKE '%Venice%';

-- St. Pete & Treasure Island: Good clarity, average shelling
UPDATE beaches SET base_clarity_score = 80, base_shell_score = 60 WHERE name LIKE '%St. Pete%';
UPDATE beaches SET base_clarity_score = 80, base_shell_score = 60 WHERE name LIKE '%Treasure Island%';

-- Melbourne Beach (East Coast): Lower clarity, average shelling
UPDATE beaches SET base_clarity_score = 50, base_shell_score = 50 WHERE name LIKE '%Melbourne%';

-- Honeymoon Island: Good clarity, above average shelling
UPDATE beaches SET base_clarity_score = 75, base_shell_score = 70 WHERE name LIKE '%Honeymoon%';

-- Pass-a-Grille (if it exists): Good clarity, great shelling
UPDATE beaches SET base_clarity_score = 85, base_shell_score = 90 WHERE name LIKE '%Pass-a-Grille%';

-- Naples (if it exists): Great clarity, great shelling
UPDATE beaches SET base_clarity_score = 90, base_shell_score = 85 WHERE name LIKE '%Naples%';

-- The Keys (if they exist): Excellent clarity, poor shelling
UPDATE beaches SET base_clarity_score = 95, base_shell_score = 30 WHERE name LIKE '%Key%';
