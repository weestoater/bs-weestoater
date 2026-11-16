-- Strava activities synced from the Strava API by the strava-sync Edge Function.

create table if not exists public.strava_activities (
  id bigint primary key,
  name text not null,
  sport_type text not null,
  start_date_local timestamptz not null,
  distance_m double precision not null default 0,
  moving_time_s integer not null default 0,
  elevation_gain_m double precision not null default 0,
  average_speed_ms double precision,
  average_heartrate double precision,
  max_heartrate double precision,
  summary_polyline text,
  -- Detail fields are filled once per activity; details_synced_at marks completion.
  description text,
  detailed_polyline text,
  calories double precision,
  details_synced_at timestamptz,
  synced_at timestamptz not null default now()
);

-- Single-row store for the rotating Strava refresh token. Service role only.
create table if not exists public.strava_tokens (
  id smallint primary key default 1 check (id = 1),
  refresh_token text not null,
  updated_at timestamptz not null default now()
);

-- Users allowed to trigger a sync. Service role only; checked via is_strava_admin().
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

alter table public.strava_activities enable row level security;
alter table public.strava_tokens enable row level security;
alter table public.admins enable row level security;

create policy "Public can read Strava activities"
  on public.strava_activities
  for select
  to anon, authenticated
  using (true);

create or replace function public.is_strava_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

grant execute on function public.is_strava_admin() to anon, authenticated;
