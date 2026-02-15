# 🏃 Quick Start: Garmin Auto-Sync

Get your Garmin activities syncing in 3 steps!

## Step 1: Install

```bash
cd backend
npm install garmin-connect
```

## Step 2: Configure

Add to your `.env` file (in project root):

```env
GARMIN_USERNAME=your-garmin-email@example.com
GARMIN_PASSWORD=your-garmin-password
```

## Step 3: Sync

```bash
node scripts/sync-garmin-activities.js
```

That's it! Your activities are now in `src/data/garminActivities.json`

## Need Help?

See the full guide: [docs/GARMIN_AUTO_SYNC_GUIDE.md](./docs/GARMIN_AUTO_SYNC_GUIDE.md)

## Security Note

⚠️ Never commit your `.env` file - it's already in `.gitignore`
