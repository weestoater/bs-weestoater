-- Add GPS data column to existing garmin_activities table
ALTER TABLE garmin_activities 
ADD COLUMN IF NOT EXISTS gps_data JSONB;

-- Create GIN index for JSONB column to enable fast queries
CREATE INDEX IF NOT EXISTS idx_garmin_activities_gps 
ON garmin_activities USING GIN (gps_data);

-- Add comment to document the column
COMMENT ON COLUMN garmin_activities.gps_data IS 'GPS tracking data including coordinates, start/end points, and route information stored as JSONB';
