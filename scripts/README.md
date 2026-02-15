# Scripts

This directory contains utility scripts for data management and conversion.

## Garmin Activity Scripts

### sync-garmin-activities.js

**Automatically sync activities from Garmin Connect**

Fetches recent activities from your Garmin Connect account and saves them to `src/data/garminActivities.json`.

```bash
node scripts/sync-garmin-activities.js
```

**Setup:**

1. Add credentials to `.env`:
   ```
   GARMIN_USERNAME=your@email.com
   GARMIN_PASSWORD=yourpassword
   ```
2. Install dependencies: `npm install --prefix backend garmin-connect`
3. Run the script

See [Garmin Auto-Sync Guide](../docs/GARMIN_AUTO_SYNC_GUIDE.md) for full documentation.

### fit-to-activity-json.js

**Convert FIT files to activity JSON**

Converts individual Garmin FIT files to the GarminActivity format.

```bash
node scripts/fit-to-activity-json.js path/to/activity.fit [output.json]
```

### convert-fit-to-json.js

**Convert FIT files to raw JSON**

Converts FIT files to complete raw JSON format (for debugging).

```bash
node scripts/convert-fit-to-json.js path/to/activity.fit [output.json]
```

## Other Scripts

### daily-steps-importer.js

Import daily steps data from CSV.

### csv-to-garmin-activities.js

Convert CSV data to Garmin activities format.

### convert-to-webp.js

Convert images to WebP format for optimization.

### flatten-json-structure.js

Flatten nested JSON structures.

### fix-\*.js

Various data fix scripts for football data.
