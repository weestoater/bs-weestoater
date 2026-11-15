#!/usr/bin/env node
/**
 * Export Strava activities from weegym Supabase and generate SQL INSERT statements
 * for importing into weestoater articles table.
 *
 * Usage:
 *   node scripts/export-strava-from-weegym.js > strava-activities.sql
 *
 * Requirements:
 *   - Must have VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from weegym .env
 */

import { createClient } from "@supabase/supabase-js";

const weegymUrl = "https://huqmjtxwlybjtmouwgaz.supabase.co";
const weegymKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1cW1qdHh3bHlianRtb3V3Z2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMTU5MTAsImV4cCI6MjA4NTY5MTkxMH0.QCFoy36CvWKVnrGli_Qe3TxanWbb0helAq1_VFtZARA";

const supabase = createClient(weegymUrl, weegymKey);

/**
 * Escape SQL string values
 */
function escapeSql(str) {
  if (str === null || str === undefined) {
    return "NULL";
  }
  return `'${str.replace(/'/g, "''")}'`;
}

/**
 * Convert activity type to icon
 */
function getActivityIcon(type) {
  const iconMap = {
    Run: "bi-person-running",
    Ride: "bi-bicycle",
    Walk: "bi-person-walking",
    Swim: "bi-water",
    Hike: "bi-snow",
    Rowing: "bi-water",
    "Inline Skate": "bi-lightning-fill",
    Skateboard: "bi-lightning-fill",
    Snowboard: "bi-snow",
    Ski: "bi-snow",
    Soccer: "bi-ball",
    Basketball: "bi-ball",
  };
  return iconMap[type] || "bi-activity";
}

/**
 * Generate slug from activity name and date
 */
function generateSlug(name, startDate) {
  const dateStr = new Date(startDate).toISOString().split("T")[0];
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
  return `strava-${dateStr}-${nameSlug}`.substring(0, 100);
}

/**
 * Calculate reading time from distance/duration
 */
function calculateReadingTime(distance, movingTime) {
  // Rough estimate: 5 min read per km, minimum 2 min
  const km = (distance || 0) / 1000;
  const minutes = Math.max(2, Math.ceil(km / 2));
  return Math.min(minutes, 30); // cap at 30 minutes
}

/**
 * Format activity data as article excerpt
 */
function formatExcerpt(activity) {
  const distance = (activity.distance / 1000).toFixed(2);
  const movingTime = Math.round(activity.moving_time / 60);
  const elevation = activity.total_elevation_gain
    ? ` +${Math.round(activity.total_elevation_gain)}m`
    : "";
  return `${distance}km in ${movingTime}min${elevation}`;
}

/**
 * Format activity HTML content
 */
function formatContent(activity) {
  const date = new Date(activity.start_date).toLocaleString();
  const distance = (activity.distance / 1000).toFixed(2);
  const movingTime = Math.round(activity.moving_time / 60);
  const avgSpeed = (activity.average_speed * 3.6).toFixed(2); // m/s to km/h

  let html = `<h3>${activity.name}</h3>`;
  html += `<p><strong>Date:</strong> ${date}</p>`;
  html += `<p><strong>Type:</strong> ${activity.type}</p>`;
  html += `<p><strong>Distance:</strong> ${distance} km</p>`;
  html += `<p><strong>Duration:</strong> ${movingTime} minutes</p>`;
  html += `<p><strong>Average Speed:</strong> ${avgSpeed} km/h</p>`;

  if (activity.total_elevation_gain) {
    html += `<p><strong>Elevation Gain:</strong> ${Math.round(activity.total_elevation_gain)}m</p>`;
  }

  if (activity.average_heartrate) {
    html += `<p><strong>Average Heart Rate:</strong> ${Math.round(activity.average_heartrate)} bpm</p>`;
  }

  if (activity.calories) {
    html += `<p><strong>Calories:</strong> ${Math.round(activity.calories)}</p>`;
  }

  return html;
}

async function main() {
  try {
    console.log("-- Export Strava Activities from weegym");
    console.log(`-- Generated: ${new Date().toISOString()}`);
    console.log("-- Import into weestoater articles table");
    console.log("");

    // Fetch strava_activities
    const { data: activities, error } = await supabase
      .from("strava_activities")
      .select("*")
      .order("start_date", { ascending: false });

    if (error) {
      console.error("-- Error fetching activities:", error.message);
      process.exit(1);
    }

    if (!activities || activities.length === 0) {
      console.log("-- No Strava activities found in weegym");
      process.exit(0);
    }

    console.log(
      `-- Found ${activities.length} Strava activities to export\n`,
    );

    // Generate INSERT statements
    for (const activity of activities) {
      const slug = generateSlug(activity.name, activity.start_date);
      const icon = getActivityIcon(activity.type);
      const readingTime = calculateReadingTime(
        activity.distance,
        activity.moving_time,
      );
      const excerpt = formatExcerpt(activity);
      const content = formatContent(activity);
      const publishedDate = new Date(activity.start_date)
        .toISOString()
        .split("T")[0];
      const tags = [activity.type];

      const sql = `INSERT INTO articles (
  id, title, slug, category, content, excerpt, icon,
  published_date, reading_time, tags, published, featured, author, order_index
) VALUES (
  ${escapeSql(slug)},
  ${escapeSql(activity.name)},
  ${escapeSql(slug)},
  'Strava',
  ${escapeSql(content)},
  ${escapeSql(excerpt)},
  ${escapeSql(icon)},
  ${escapeSql(publishedDate)},
  ${readingTime},
  ${escapeSql(JSON.stringify(tags))},
  true,
  false,
  'Strava Import',
  0
) ON CONFLICT(id) DO NOTHING;`;

      console.log(sql);
      console.log("");
    }

    console.log(
      `-- Summary: ${activities.length} articles ready to import into weestoater`,
    );
  } catch (err) {
    console.error("-- Error:", err.message);
    process.exit(1);
  }
}

main();
