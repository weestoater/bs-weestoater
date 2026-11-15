#!/usr/bin/env node

/**
 * Strava Data Migration Script
 * Exports activities from weegym's Supabase → Imports to bs-weestoater's Supabase
 *
 * Usage:
 *   node scripts/migrate-strava-data.js [--dry-run] [--count-only]
 *
 * Flags:
 *   --dry-run      Show what would be migrated without actually doing it
 *   --count-only   Just count records in weegym without importing
 */

import { createClient } from "@supabase/supabase-js";

// Weegym Supabase (source)
const WEEGYM_URL = "https://huqmjtxwlybjtmouwgaz.supabase.co";
const WEEGYM_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1cW1qdHh3bHlianRtb3V3Z2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMTU5MTAsImV4cCI6MjA4NTY5MTkxMH0.QCFoy36CvWKVnrGli_Qe3TxanWbb0helAq1_VFtZARA";

// bs-weestoater Supabase (destination)
const BS_WEESTOATER_URL =
  process.env.VITE_SUPABASE_URL || "https://bvagseoxnweowmdwerct.supabase.co";
const BS_WEESTOATER_KEY =
  process.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2YWdzZW94bndlb3dtZHdlcmN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMDQ0OTYsImV4cCI6MjA4NjY4MDQ5Nn0.xM_ndvrY5JDhJFyCvkLG8NyrUZ31LzMWqiNL84ZcW_U";

// Parse command line flags
const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run");
const isCountOnly = args.includes("--count-only");

const weegym = createClient(WEEGYM_URL, WEEGYM_KEY);
const bsWeestoater = createClient(BS_WEESTOATER_URL, BS_WEESTOATER_KEY);

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

function log(color, label, message) {
  console.log(
    `${color}${label}${colors.reset} ${message}`,
  );
}

async function testConnections() {
  log(colors.blue, "→", "Testing Supabase connections...\n");

  try {
    log(colors.cyan, "📦", "Weegym Supabase...");
    const weegymTest = await weegym
      .from("strava_connections")
      .select("id")
      .limit(1);
    if (weegymTest.error) {
      log(colors.red, "✗", `Weegym connection failed: ${weegymTest.error.message}`);
      return false;
    }
    log(colors.green, "✓", "Weegym connected\n");

    log(colors.cyan, "📦", "bs-weestoater Supabase...");
    const bsTest = await bsWeestoater
      .from("strava_activities")
      .select("id")
      .limit(1);
    if (bsTest.error) {
      log(
        colors.red,
        "✗",
        `bs-weestoater connection failed: ${bsTest.error.message}`,
      );
      return false;
    }
    log(colors.green, "✓", "bs-weestoater connected\n");

    return true;
  } catch (err) {
    log(colors.red, "✗", `Connection test failed: ${err.message}`);
    return false;
  }
}

async function countRecords() {
  log(colors.blue, "→", "Counting records in weegym...\n");

  try {
    const { count: activitiesCount, error: activitiesError } = await weegym
      .from("strava_activities")
      .select("*", { count: "exact", head: true });

    if (activitiesError) throw activitiesError;

    const { count: recordsCount, error: recordsError } = await weegym
      .from("strava_personal_records")
      .select("*", { count: "exact", head: true });

    if (recordsError) throw recordsError;

    const { count: connectionsCount, error: connectionsError } = await weegym
      .from("strava_connections")
      .select("*", { count: "exact", head: true });

    if (connectionsError) throw connectionsError;

    log(colors.cyan, "📊", `strava_activities: ${activitiesCount || 0} records`);
    log(colors.cyan, "📊", `strava_personal_records: ${recordsCount || 0} records`);
    log(colors.cyan, "📊", `strava_connections: ${connectionsCount || 0} records\n`);

    return {
      activities: activitiesCount || 0,
      records: recordsCount || 0,
      connections: connectionsCount || 0,
    };
  } catch (err) {
    log(colors.red, "✗", `Failed to count records: ${err.message}`);
    return null;
  }
}

async function migrateActivities() {
  log(colors.blue, "→", "Migrating strava_activities...\n");

  try {
    // Fetch all activities from weegym
    const { data: activities, error: fetchError } = await weegym
      .from("strava_activities")
      .select("*");

    if (fetchError) throw fetchError;

    if (!activities || activities.length === 0) {
      log(colors.yellow, "⚠", "No activities found in weegym");
      return 0;
    }

    log(colors.cyan, "📥", `Found ${activities.length} activities to migrate`);

    if (isDryRun) {
      log(colors.yellow, "🔄", "[DRY RUN] Would insert " + activities.length + " activities");
      return activities.length;
    }

    // Insert into bs-weestoater
    const { error: insertError } = await bsWeestoater
      .from("strava_activities")
      .insert(activities, { returning: "minimal" });

    if (insertError) {
      log(colors.red, "✗", `Failed to insert activities: ${insertError.message}`);
      throw insertError;
    }

    log(colors.green, "✓", `Migrated ${activities.length} activities\n`);
    return activities.length;
  } catch (err) {
    log(colors.red, "✗", `Activity migration failed: ${err.message}`);
    throw err;
  }
}

async function migratePersonalRecords() {
  log(colors.blue, "→", "Migrating strava_personal_records...\n");

  try {
    // Fetch all records from weegym
    const { data: records, error: fetchError } = await weegym
      .from("strava_personal_records")
      .select("*");

    if (fetchError) throw fetchError;

    if (!records || records.length === 0) {
      log(colors.yellow, "⚠", "No personal records found in weegym");
      return 0;
    }

    log(colors.cyan, "📥", `Found ${records.length} personal records to migrate`);

    if (isDryRun) {
      log(
        colors.yellow,
        "🔄",
        "[DRY RUN] Would insert " + records.length + " personal records",
      );
      return records.length;
    }

    // Insert into bs-weestoater
    const { error: insertError } = await bsWeestoater
      .from("strava_personal_records")
      .insert(records, { returning: "minimal" });

    if (insertError) {
      log(colors.red, "✗", `Failed to insert personal records: ${insertError.message}`);
      throw insertError;
    }

    log(colors.green, "✓", `Migrated ${records.length} personal records\n`);
    return records.length;
  } catch (err) {
    log(colors.red, "✗", `Personal records migration failed: ${err.message}`);
    throw err;
  }
}

async function migrateConnections() {
  log(colors.blue, "→", "Migrating strava_connections...\n");

  try {
    // Fetch all connections from weegym
    const { data: connections, error: fetchError } = await weegym
      .from("strava_connections")
      .select("*");

    if (fetchError) throw fetchError;

    if (!connections || connections.length === 0) {
      log(colors.yellow, "⚠", "No strava connections found in weegym");
      return 0;
    }

    log(colors.cyan, "📥", `Found ${connections.length} connections to migrate`);

    if (isDryRun) {
      log(
        colors.yellow,
        "🔄",
        "[DRY RUN] Would insert " + connections.length + " connections",
      );
      return connections.length;
    }

    // Insert into bs-weestoater
    const { error: insertError } = await bsWeestoater
      .from("strava_connections")
      .insert(connections, { returning: "minimal" });

    if (insertError) {
      log(
        colors.red,
        "✗",
        `Failed to insert connections: ${insertError.message}`,
      );
      throw insertError;
    }

    log(colors.green, "✓", `Migrated ${connections.length} connections\n`);
    return connections.length;
  } catch (err) {
    log(colors.red, "✗", `Connections migration failed: ${err.message}`);
    throw err;
  }
}

async function main() {
  log(colors.bright, "🚀", "Strava Data Migration Tool\n");

  if (isDryRun) {
    log(colors.yellow, "⚠", "DRY RUN MODE - No data will be modified\n");
  }

  // Test connections
  const connected = await testConnections();
  if (!connected) {
    log(colors.red, "✗", "Could not connect to Supabase projects");
    process.exit(1);
  }

  // Count records
  const counts = await countRecords();
  if (!counts) {
    log(colors.red, "✗", "Could not read from weegym");
    process.exit(1);
  }

  if (isCountOnly) {
    log(colors.green, "✓", "Count complete");
    process.exit(0);
  }

  // Run migration
  log(colors.bright, "📋", "Starting data migration...\n");

  try {
    const activitiesMigrated = await migrateActivities();
    const recordsMigrated = await migratePersonalRecords();
    const connectionsMigrated = await migrateConnections();

    // Summary
    log(colors.bright, "✅", "Migration Summary:\n");
    log(colors.cyan, "📊", `Activities: ${activitiesMigrated} migrated`);
    log(colors.cyan, "📊", `Personal Records: ${recordsMigrated} migrated`);
    log(colors.cyan, "📊", `Connections: ${connectionsMigrated} migrated`);

    const totalMigrated = activitiesMigrated + recordsMigrated + connectionsMigrated;
    log(
      colors.green,
      "✓",
      `Total: ${totalMigrated} records migrated successfully\n`,
    );

    if (isDryRun) {
      log(colors.yellow, "ℹ", "Run without --dry-run to actually migrate data\n");
    }
  } catch (err) {
    log(colors.red, "✗", `Migration failed: ${err.message}`);
    process.exit(1);
  }
}

main();
