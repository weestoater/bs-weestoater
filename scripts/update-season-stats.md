# Update Football Season Stats

This script recalculates and upserts the `football_season_stats` table for a given season, ensuring top scorers and assists are always up to date after new goals are added.

## Usage

````
```js
````

- Example: `node scripts/update-season-stats.js 2025-26`

## Requirements

- Node.js
- Environment variables set in a `.env` file or your environment:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`

## What it does

- Fetches all matches and goals for the given season from Supabase
- Aggregates goals and assists for each player
- Upserts the totals into the `football_season_stats` table

## When to run

- After adding or editing goals in the admin interface
- Can be automated as a post-match step or via a scheduled job

---

If you want this to run automatically after every goal/match update, consider integrating the logic into your backend or admin workflow.
