# Strava sync

The Strava page reads activities from Supabase (`strava_activities`). An admin runs **Sync from Strava** from the Admin Dashboard's Strava card (`/admin/strava`), which calls the `strava-sync` Edge Function. The function fetches from Strava with the server-side secrets and upserts into Supabase. Strava credentials never reach the browser.

## One-time setup

1. Log in and link the project (run these yourself; they open a browser):

   ```bash
   npx supabase@latest login
   npx supabase@latest link --project-ref bvagseoxnweowmdwerct
   ```

2. Apply the migration (creates `strava_activities`, `strava_tokens`, `admins`, and `is_strava_admin()`):

   ```bash
   npx supabase@latest db push
   ```

3. Set the function secrets. Use the current refresh token from `.strava-state.json` if it exists, since Strava rotates it. Do not use `--env-file .env`, which would also push unrelated keys:

   ```bash
   npx supabase@latest secrets set STRAVA_CLIENT_ID=... STRAVA_CLIENT_SECRET=... STRAVA_REFRESH_TOKEN=...

   Trim values before setting them. A trailing carriage return or space from `.env` makes Strava return 401 ("token refresh failed").
   ```

4. Deploy the function:

   ```bash
   npx supabase@latest functions deploy strava-sync
   ```

5. Make yourself an admin. Sign in on the site first, then run this in the Supabase SQL editor, replacing the email:

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'you@example.com'
   on conflict do nothing;
   ```

After that the sync button appears on the Strava admin page (`/admin/strava`) for signed-in admins. The first sync stores the summaries and then fills in details for up to 80 activities per run.

Note: if an older `strava_activities` table already existed in the project, the migration's `create table if not exists` kept it and the sync failed with a missing-column error. Rename it first (for example to `strava_activities_legacy`) and re-run the migration.

## Scheduled sync (optional)

To sync without the button, schedule the function with `pg_cron` and `pg_net` (enable both under Database > Extensions). Store the service role key in Vault, not in the SQL itself:

```sql
select vault.create_secret('<service-role-key>', 'strava_sync_key');

select cron.schedule(
  'strava-sync',
  '*/30 * * * *',
  $$
  select net.http_post(
    url := 'https://bvagseoxnweowmdwerct.supabase.co/functions/v1/strava-sync',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'strava_sync_key')
    )
  );
  $$
);
```

## Rate limits

Strava allows about 100 requests per 15 minutes and 1000 per day. Each run makes one list request per 200 activities and up to 80 detail requests. If Strava returns 429, the run stops and the rest is picked up next time.

## Refresh token rotation

Strava issues a new refresh token on each refresh. The function saves it to `strava_tokens`, which is readable only by the service role. If you rotate the token in Strava, run `secrets set STRAVA_REFRESH_TOKEN=...` again and clear the row in `strava_tokens`.

## Fallback: JSON files on the Linux server

`scripts/sync-strava.js` is still available. It writes static JSON, which is the same data without Supabase. It is not used by the page now.

| File | Contents |
|---|---|
| `activities.json` | `{ syncedAt, activities }`, rewritten on every run |
| `activity-<id>.json` | Detail for one activity, fetched once and then reused |

Run it locally with `node --env-file=.env scripts/sync-strava.js`. Its state lives in `.strava-state.json`, which is gitignored.

