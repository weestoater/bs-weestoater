# Strava sync

The Strava page reads static JSON files instead of calling Strava from the browser. `scripts/sync-strava.js` writes them, and the site serves them from `/data/strava/`.

## Output

| File | Contents |
|---|---|
| `activities.json` | `{ syncedAt, activities }`, rewritten on every run |
| `activity-<id>.json` | Detail for one activity, fetched once and then reused |

## Running it

Locally (dev output goes to `public/data/strava/`, which is gitignored):

```bash
node --env-file=.env scripts/sync-strava.js
```

On the Linux server, add a cron entry (every 15 minutes) that writes straight into the web root:

```cron
*/15 * * * * cd /path/to/bs-weestoater && STRAVA_OUTPUT_DIR=/var/www/weestoater/data/strava /usr/bin/node --env-file=.env scripts/sync-strava.js >> /var/log/strava-sync.log 2>&1
```

Requirements on the server:

- Node.js 20 or newer.
- `.env` in the project root with `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, `STRAVA_REFRESH_TOKEN`. It is never committed.
- Write access to `STRAVA_OUTPUT_DIR`.

## Deploying

Your deploy step must not delete the generated folder. For example, with rsync:

```bash
rsync -av --delete --exclude 'data/strava/' dist/ /var/www/weestoater/
```

## Refresh token rotation

Strava can issue a new refresh token on each refresh. The script saves the latest one to `.strava-state.json` (gitignored) and uses it on the next run. After you manually rotate the token in `.env`, delete `.strava-state.json` so the new value is used.

## Rate limits

Strava allows a limited number of requests per 15 minutes and per day. Details are only fetched for new activities, so a steady-state run makes one list request. If the limit is hit, the script stops and fetches the rest on the next run.
