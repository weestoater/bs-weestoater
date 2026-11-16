export const METERS_PER_MILE = 1609.344;
export const KM_PER_MILE = 1.60934;
export const FEET_PER_METER = 3.28084;
export const MPH_PER_METER_PER_SECOND = 2.236936;

export function formatDistance(miles: number | null, metric: boolean): string {
  if (miles === null) return "N/A";
  if (metric) return `${(miles * KM_PER_MILE).toFixed(1)} km`;
  return `${miles.toFixed(1)} mi`;
}

export function formatSpeed(mph: number | null, metric: boolean): string {
  if (mph === null) return "N/A";
  if (metric) return `${(mph * KM_PER_MILE).toFixed(1)} km/h`;
  return `${mph.toFixed(1)} mph`;
}

export function formatDuration(minutes: number | null): string {
  if (minutes === null) return "N/A";
  const totalMinutes = Math.round(minutes);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function formatActivityDateTime(startDateLocal: string): string {
  // start_date_local is the athlete's local wall-clock time, marked with a trailing Z,
  // so it is formatted in UTC to show the original time unchanged.
  const date = new Date(startDateLocal);
  if (Number.isNaN(date.getTime())) return startDateLocal;

  const weekday = date.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
  const month = date.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${weekday}, ${day} ${month} ${year} at ${hours}:${minutes}`;
}
