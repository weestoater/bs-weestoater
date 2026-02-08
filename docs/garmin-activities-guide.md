# Garmin Activity Integration Guide

This guide explains how to add your Garmin Connect activities to the Slimming World page.

## Quick Start

### Option 1: Manual Entry (Simplest)

Edit `src/data/garminActivities.json` and add activities manually:

```json
[
  {
    "id": "unique-id-here",
    "date": "2026-02-07T09:30:00.000Z",
    "type": "running",
    "distance": 5.2,
    "duration": 1800,
    "calories": 450,
    "averageHeartRate": 145,
    "maxHeartRate": 165,
    "averagePace": 5.77,
    "notes": "Morning run"
  }
]
```

**Activity Types:** `running`, `cycling`, `walking`, `swimming`, `other`

**Fields:**

- `id` (required): Unique identifier
- `date` (required): ISO date string
- `type` (required): Activity type
- `distance` (required): Distance in kilometers
- `duration` (required): Duration in seconds
- `calories` (optional): Calories burned
- `averageHeartRate` (optional): Average heart rate
- `maxHeartRate` (optional): Maximum heart rate
- `averagePace` (optional): Pace in minutes per kilometer
- `elevation` (optional): Elevation gain in meters
- `notes` (optional): Free text notes

### Option 2: Export from Garmin Connect

#### Step 1: Export Activities

1. Go to [Garmin Connect](https://connect.garmin.com)
2. Click on an activity
3. Click the gear icon (⚙️) in the top right
4. Select **"Export Original"** - downloads a `.FIT` file

#### Step 2: Convert FIT to JSON

Run the conversion script:

```bash
node scripts/fit-to-activity-json.js path/to/your/activity.fit
```

This creates an activity JSON file with the correct format.

#### Step 3: Add to Your Activities

1. Open the generated JSON file
2. Copy the activity object
3. Add it to the array in `src/data/garminActivities.json`

**Example:**

```json
[
  {
    "id": "abc123",
    "date": "2026-02-07T09:30:00.000Z",
    "type": "running",
    "distance": 5.2,
    "duration": 1800
  },
  // Add your new activity here
  {
    "id": "def456",
    "date": "2026-02-08T10:00:00.000Z",
    "type": "cycling",
    "distance": 15.0,
    "duration": 2700
  }
]
```

## Bulk Export (Advanced)

To export all your Garmin data:

1. Go to Garmin Connect → Account Settings
2. Navigate to **Data Management**
3. Click **"Request Data Export"**
4. Wait for email with download link (can take hours/days)
5. Download and extract the ZIP file
6. Find activity FIT files and convert them individually

## Scripts Available

### fit-to-activity-json.js

Converts FIT files to the simplified GarminActivity format used by the app.

```bash
node scripts/fit-to-activity-json.js <fit-file> [output-file]
```

### convert-fit-to-json.js

Converts FIT files to full raw JSON with all data fields (for debugging).

```bash
node scripts/convert-fit-to-json.js <fit-file> [output-file]
```

## Example Data

See `src/data/garminActivities.example.json` for sample activity data.

## Display

Activities are displayed on the Slimming World page in two sections:

1. **Activity Summary Card** - Total statistics (activities, distance, duration, calories)
2. **Recent Activities List** - Up to 10 most recent activities with details

## Troubleshooting

**No activities showing?**

- Check that `src/data/garminActivities.json` is not empty
- Verify the JSON is valid (no syntax errors)
- Check browser console for errors

**FIT conversion errors?**

- Ensure `fit-file-parser` is installed: `npm install fit-file-parser --legacy-peer-deps`
- Verify the FIT file is not corrupted
- Try exporting the activity again from Garmin Connect

**TypeScript errors?**

- Ensure all required fields are present (`id`, `date`, `type`, `distance`, `duration`)
- Check that `type` is one of the allowed values
- Verify date is in ISO string format

## Tips

- Activities are sorted by date (most recent first automatically)
- Use descriptive `notes` field for special workouts
- Keep the array size reasonable (10-20 activities) for best performance
- Delete old activities or archive them separately as needed

## Future Enhancements

Potential improvements:

- Strava API integration for automatic sync
- Direct Garmin API integration (requires partnership)
- Charts showing activity trends over time
- Correlation between activities and weight loss
