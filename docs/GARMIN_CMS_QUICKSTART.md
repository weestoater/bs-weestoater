# 🚀 Garmin CMS Quick Start

Store your Garmin activities in Supabase CMS in 4 simple steps!

## Step 1: Run SQL Schema (2 minutes)

1. Open Supabase Dashboard → SQL Editor
2. Copy & paste: [`backend/supabase/garmin-activities-schema.sql`](../backend/supabase/garmin-activities-schema.sql)
3. Click **Run**
4. ✅ Table created!

## Step 2: Migrate Existing Data (1 minute)

```bash
cd backend
npm run migrate-garmin
```

✅ Your activities are now in Supabase!

## Step 3: Test It (30 seconds)

```bash
npm run dev
```

Navigate to Slimming World page → Activities load from database!

## Step 4: Sync New Activities (2 minutes)

```bash
node scripts/sync-garmin-activities.js
```

When asked **"Sync to Supabase database?"** → Type **y**

✅ Done! Activities synced to both JSON and Supabase.

---

## 📝 What You Get

✅ Activities stored in Supabase database  
✅ Edit activities through SQL/admin panel  
✅ Real-time updates without rebuild  
✅ Fallback to JSON if Supabase unavailable  
✅ Better performance and scalability

## 🔧 Required in `.env`

```env
# Already have these for books CMS:
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyXxXx...
```

## 📖 Full Guide

See [GARMIN_CMS_INTEGRATION.md](./GARMIN_CMS_INTEGRATION.md) for:

- Complete setup instructions
- Security configuration
- Query examples
- Troubleshooting
- Admin interface options

## 🆘 Quick Troubleshooting

**Activities not showing?**

- Check Supabase credentials in `.env`
- Verify table exists in Supabase dashboard
- Check browser console for errors

**Migration failed?**

- Run schema SQL first
- Check Supabase credentials
- Verify JSON file exists

---

**Total time:** ~5 minutes 🎉
