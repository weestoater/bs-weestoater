#!/usr/bin/env node

/**
 * Migrate Garmin Activities to Supabase
 *
 * This script imports existing garminActivities.json data into Supabase.
 * Run this once to migrate from JSON file storage to database storage.
 *
 * Usage:
 *   node backend/supabase/migrate-garmin-activities.js
 */

import { createSupabaseClient } from "./client.js";
import { createGarminActivitiesService } from "./garminActivitiesDatabase.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function migrateActivities() {
  console.log("🏃 Garmin Activities Migration to Supabase");
  console.log("==========================================\n");

  try {
    // 1. Load existing JSON data
    const jsonPath = path.resolve(
      __dirname,
      "../../src/data/garminActivities.json",
    );
    console.log(`📂 Loading activities from: ${jsonPath}`);

    const jsonData = await fs.readFile(jsonPath, "utf8");
    const activities = JSON.parse(jsonData);

    console.log(`✅ Loaded ${activities.length} activities from JSON\n`);

    // 2. Connect to Supabase
    console.log("🔌 Connecting to Supabase...");
    const supabase = createSupabaseClient({
      url: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
      anonKey:
        process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY,
    });

    const garminService = createGarminActivitiesService(supabase);
    console.log("✅ Connected to Supabase\n");

    // 3. Check if table exists by trying to fetch
    console.log("🔍 Checking if garmin_activities table exists...");
    try {
      await garminService.getActivities({ limit: 1 });
      console.log("✅ Table exists\n");
    } catch (error) {
      console.error("❌ Error: garmin_activities table not found!");
      console.error("   Please run the schema SQL first:");
      console.error("   backend/supabase/garmin-activities-schema.sql\n");
      process.exit(1);
    }

    // 4. Upsert activities (this will insert new ones and update existing ones)
    console.log(`📥 Upserting ${activities.length} activities to Supabase...`);

    const result = await garminService.upsertActivities(activities);

    console.log(`✅ Successfully upserted ${result.length} activities\n`);

    // 5. Verify the data
    console.log("🔍 Verifying data...");
    const allActivities = await garminService.getActivities({ limit: 1000 });
    console.log(`✅ Found ${allActivities.length} activities in database\n`);

    // 6. Show summary
    const stats = await garminService.getTotalStatistics();
    console.log("📊 Database Summary:");
    console.log(`   Total Activities: ${stats.totalActivities}`);
    console.log(`   Total Distance: ${stats.totalDistance.toFixed(2)} miles`);
    console.log(
      `   Total Duration: ${Math.floor(stats.totalDuration / 3600)}h ${Math.floor((stats.totalDuration % 3600) / 60)}m`,
    );
    console.log(`   Total Calories: ${stats.totalCalories.toLocaleString()}`);
    if (stats.totalSteps > 0) {
      console.log(`   Total Steps: ${stats.totalSteps.toLocaleString()}`);
    }

    console.log("\n✅ Migration completed successfully!");
    console.log("\n📝 Next Steps:");
    console.log("   1. Update your sync script to push to Supabase");
    console.log("   2. Update your frontend to fetch from Supabase");
    console.log("   3. Test the integration");
    console.log("   4. Consider backing up and removing the JSON file\n");
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
    if (error.details) console.error("   Details:", error.details);
    if (error.hint) console.error("   Hint:", error.hint);
    process.exit(1);
  }
}

// Run migration
migrateActivities();
