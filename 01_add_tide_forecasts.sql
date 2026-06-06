-- Migration: Add tide_forecasts table

CREATE TABLE tide_forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beach_id UUID REFERENCES beaches(id) ON DELETE CASCADE,
  prediction_time TIMESTAMP WITH TIME ZONE NOT NULL,
  water_level DECIMAL NOT NULL,
  type VARCHAR(10) CHECK (type IN ('H', 'L')), -- High or Low tide
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Index for querying forecasts for a specific beach, ordered by time
CREATE INDEX idx_tide_forecasts_beach_time ON tide_forecasts (beach_id, prediction_time);
