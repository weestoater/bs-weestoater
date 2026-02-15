# 🏃 Garmin Auto-Sync Setup Guide

This guide explains how to automatically pull activity data from your Garmin Connect account directly into the SW Activities section.

## � NEW: Store in Supabase CMS

**Want to store activities in a database instead of JSON?**

👉 **See the [Garmin CMS Integration Guide](./GARMIN_CMS_INTEGRATION.md)** for database storage!

Benefits of using Supabase:

- ✅ Edit activities through admin interface
- ✅ Better performance and scalability
- ✅ Real-time updates without rebuild
- ✅ Query and analyze your data

Quick start: [GARMIN_CMS_QUICKSTART.md](./GARMIN_CMS_QUICKSTART.md) (~5 minutes)

---

## �📋 Overview

The Garmin auto-sync feature allows you to:

- Automatically fetch recent activities from Garmin Connect
- Sync activities with a single command
- View activities on the Slimming World page
- Track fitness progress alongside weight loss

## 🚀 Quick Setup

### Step 1: Install Dependencies

Install the required npm package:

```bash
cd backend
npm install garmin-connect
```

Or from the project root:

```bash
npm install --prefix backend garmin-connect
```

### Step 2: Configure Credentials

Add your Garmin Connect credentials to the `.env` file in your project root:

```env
# Garmin Connect Integration
GARMIN_USERNAME=your-garmin-email@example.com
GARMIN_PASSWORD=your-garmin-password
```

**Important Security Notes:**

- ⚠️ Never commit your `.env` file to Git
- ⚠️ The `.env` file is already in `.gitignore`
- ⚠️ Use a strong, unique password for your Garmin account
- ⚠️ Consider using 2FA on your Garmin account

### Step 3: Run the Sync Script

Sync your activities using the command line:

```bash
node scripts/sync-garmin-activities.js
```

Or use the npm script:

```bash
npm run sync-garmin --prefix backend
```

### Step 4: View Your Activities

1. Refresh your website
2. Navigate to the Slimming World page
3. View your synced activities in the "Fitness Activities" section

## 💻 Usage Options

### Option 1: Command Line Sync (Recommended)

Run the sync script directly:

```bash
node scripts/sync-garmin-activities.js
```

**Features:**

- Interactive prompts for credentials (if not in .env)
- Choose how many activities to sync
- See sync progress and summary
- Most reliable method

**Example Output:**

```
🏃 Garmin Connect Activity Sync
================================

How many recent activities to sync? (default: 20): 20

⏳ Syncing 20 activities...

✅ Successfully authenticated with Garmin Connect
📥 Fetching last 20 activities from Garmin Connect...
✅ Fetched 20 activities
✅ Saved 20 activities to d:/git/bs-weestoater/src/data/garminActivities.json

📊 Sync Summary:
   Activities synced: 20
   Total distance: 45.6 miles
   Duration: 4.23s
   Activity types: walking, running, cycling

✅ Sync completed successfully!
```

### Option 2: Manual Credentials (No .env)

If you prefer not to store credentials in `.env`:

```bash
GARMIN_USERNAME=your@email.com GARMIN_PASSWORD=yourpass node scripts/sync-garmin-activities.js
```

### Option 3: UI Button (Coming Soon)

The "Sync Garmin" button in the UI is currently a placeholder. To enable it:

1. Deploy the serverless function to Netlify
2. Add Garmin credentials to Netlify environment variables
3. The button will automatically fetch new activities

## 🔧 Configuration

### Sync Settings

You can customize the sync behavior:

**Number of Activities:**

- Default: 20 most recent activities
- Maximum: 100 activities (Garmin API limit)
- Specify when running: `node scripts/sync-garmin-activities.js`

**Activity Filters:**
The script automatically:

- Filters out activities with no distance
- Sorts by date (most recent first)
- Transforms to your data format

### Data Storage

Activities are saved to: `src/data/garminActivities.json`

**Format:**

```json
[
  {
    "id": "unique-activity-id",
    "date": "2026-02-15T09:30:00.000Z",
    "type": "running",
    "distance": 3.5,
    "duration": 1800,
    "calories": 350,
    "averageHeartRate": 145,
    "maxHeartRate": 165,
    "averagePace": 8.57,
    "elevation": 120,
    "steps": 5000,
    "notes": "Morning run"
  }
]
```

## 🎯 Activity Types

The sync automatically maps Garmin activity types:

| Garmin Type                           | Mapped To  |
| ------------------------------------- | ---------- |
| Running, Trail Running, Treadmill     | `running`  |
| Cycling, Road Biking, Mountain Biking | `cycling`  |
| Walking                               | `walking`  |
| Swimming, Lap Swimming, Open Water    | `swimming` |
| Other activities                      | `other`    |

## 🔒 Security Best Practices

### Protect Your Credentials

1. **Use Environment Variables:**
   - Store credentials in `.env`
   - Never hardcode credentials
   - Never commit `.env` to Git

2. **Enable 2FA on Garmin:**
   - Add extra security to your Garmin account
   - Use authenticator apps (not SMS)

3. **Use App-Specific Passwords:**
   - If Garmin supports it, create a separate password for this app

4. **Limit Scope:**
   - Only sync data, don't use write permissions
   - Review connected apps regularly in Garmin settings

### For Netlify Deployment

If using serverless functions:

1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add `GARMIN_USERNAME` and `GARMIN_PASSWORD`
3. Redeploy your site

## 🐛 Troubleshooting

### Authentication Failed

**Problem:** Login fails with "Authentication failed"

**Solutions:**

- ✅ Verify your email and password are correct
- ✅ Check if you have 2FA enabled (may require special setup)
- ✅ Try logging in to Garmin Connect website to ensure account is active
- ✅ Check for typos in `.env` file variables

### No Activities Found

**Problem:** Sync completes but shows 0 activities

**Solutions:**

- ✅ Ensure you have activities recorded in Garmin Connect
- ✅ Check the date range (script fetches recent activities)
- ✅ Verify activities have distance data (activities without distance are filtered)

### Module Not Found: garmin-connect

**Problem:** Script fails with module not found error

**Solutions:**

- ✅ Run `npm install --prefix backend garmin-connect`
- ✅ Check you're running from project root
- ✅ Verify `backend/package.json` includes the dependency

### JSON Parse Error

**Problem:** Website shows error loading activities

**Solutions:**

- ✅ Check `src/data/garminActivities.json` is valid JSON
- ✅ Run sync script again to regenerate file
- ✅ Check browser console for specific error

### Rate Limiting

**Problem:** Sync fails after multiple attempts

**Solutions:**

- ✅ Wait 5-10 minutes before trying again
- ✅ Don't sync too frequently (once per day is usually sufficient)
- ✅ Garmin may temporarily block if too many requests

## 📅 Recommended Workflow

### Daily Sync Routine

1. Record your activities on your Garmin watch
2. Wait for activities to sync to Garmin Connect (automatic)
3. Run the sync script: `node scripts/sync-garmin-activities.js`
4. Refresh your website to see updated activities

### Weekly Review

- Review activity trends on the SW page
- Compare activity levels with weight loss progress
- Adjust fitness goals based on results

## 🚀 Advanced: Automated Sync

### Option 1: Cron Job (Linux/Mac)

Set up a daily sync:

```bash
# Edit crontab
crontab -e

# Add line to run daily at 8 PM
0 20 * * * cd /path/to/bs-weestoater && node scripts/sync-garmin-activities.js
```

### Option 2: Task Scheduler (Windows)

1. Open Task Scheduler
2. Create Basic Task
3. Trigger: Daily at your preferred time
4. Action: Start a program
5. Program: `node`
6. Arguments: `C:\path\to\bs-weestoater\scripts\sync-garmin-activities.js`
7. Start in: `C:\path\to\bs-weestoater`

### Option 3: GitHub Actions

Create `.github/workflows/sync-garmin.yml`:

```yaml
name: Sync Garmin Activities
on:
  schedule:
    - cron: "0 20 * * *" # Daily at 8 PM UTC
  workflow_dispatch: # Manual trigger

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm install --prefix backend
      - run: node scripts/sync-garmin-activities.js
        env:
          GARMIN_USERNAME: ${{ secrets.GARMIN_USERNAME }}
          GARMIN_PASSWORD: ${{ secrets.GARMIN_PASSWORD }}
      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add src/data/garminActivities.json
          git commit -m "Auto-sync Garmin activities" || exit 0
          git push
```

Add secrets in GitHub repo settings.

## 📝 Notes

- **Privacy:** Activity data is stored locally in your repository
- **Data Ownership:** You own all activity data
- **Updates:** Sync only updates the JSON file, doesn't modify existing data
- **Backup:** Consider backing up `garminActivities.json` periodically

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review error messages carefully
3. Check Garmin Connect service status
4. Verify your credentials are correct

## 🎉 Success!

Once set up, you'll have automatic activity tracking integrated with your Slimming World progress!

**Next Steps:**

- Set up a regular sync schedule
- Review activity correlations with weight loss
- Adjust fitness goals based on insights
