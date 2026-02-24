#!/usr/bin/env node

/**
 * Migrate Slimming World Data to Supabase
 *
 * This script imports existing slimmingWorldData.json data into Supabase.
 * Run this once to migrate from JSON file storage to database storage.
 *
 * Usage:
 *   node backend/supabase/migrate-slimming-world.js
 */

import { createSupabaseClient } from "./client.js";
import { createDatabaseService } from "./database.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

/**
 * Convert DD/MM/YYYY date format to YYYY-MM-DD
 * @param {string} dateStr - Date in DD/MM/YYYY format
 * @returns {string} Date in YYYY-MM-DD format
 */
function convertDateFormat(dateStr) {
  const [day, month, year] = dateStr.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

/**
 * Main migration function
 */
async function migrateSlimmingWorldData() {
  console.log("⚖️  Slimming World Data Migration to Supabase");
  console.log("=============================================\n");

  try {
    // 1. Load existing JSON data
    const jsonPath = path.resolve(
      __dirname,
      "../../src/data/slimmingWorldData.json",
    );
    console.log(`📂 Loading data from: ${jsonPath}`);

    const jsonData = await fs.readFile(jsonPath, "utf8");
    const swData = JSON.parse(jsonData);

    if (!swData || swData.length === 0) {
      console.error("❌ No data found in JSON file");
      process.exit(1);
    }

    const profileData = swData[0];
    console.log(`✅ Loaded profile with ${profileData.data.length} entries\n`);

    // 2. Connect to Supabase
    console.log("🔌 Connecting to Supabase...");

    // Use SERVICE_ROLE key for migrations to bypass RLS
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey =
      process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;

    if (!serviceKey) {
      console.warn("⚠️  WARNING: SUPABASE_SERVICE_ROLE_KEY not found!");
      console.warn(
        "    Using anon key, but this may fail due to RLS policies.",
      );
      console.warn(
        "    Add SUPABASE_SERVICE_ROLE_KEY to your .env file for migrations.\n",
      );
    }

    const supabase = createSupabaseClient({
      url: url,
      anonKey: serviceKey || anonKey, // Use service key if available, fallback to anon
    });

    const dbService = createDatabaseService(supabase);
    console.log("✅ Connected to Supabase\n");

    // 3. Check if tables exist
    console.log("🔍 Checking if slimming_world tables exist...");
    try {
      await dbService.getSlimmingWorldProfiles();
      console.log("✅ Tables exist\n");
    } catch (error) {
      console.error("❌ Error: slimming_world tables not found!");
      console.error("   Please run the schema SQL first:");
      console.error("   backend/supabase/slimming-world-schema.sql\n");
      console.error("   Error details:", error.message);
      process.exit(1);
    }

    // 4. Check if profile already exists
    const userId = "default"; // Default user ID - can be customized
    console.log(`🔍 Checking for existing profile (user_id: ${userId})...`);
    let existingProfile =
      await dbService.getSlimmingWorldProfileByUserId(userId);

    let profile;
    if (existingProfile) {
      console.log("⚠️  Profile already exists. Updating...");
      profile = await dbService.updateSlimmingWorldProfile(existingProfile.id, {
        start_date: convertDateFormat(profileData.startDate),
        start_weight: profileData.startWeight,
        target_weight: profileData.targetWeight,
      });
      console.log(`✅ Updated profile: ${profile.id}\n`);
    } else {
      // 5. Create profile
      console.log("📝 Creating Slimming World profile...");
      profile = await dbService.createSlimmingWorldProfile({
        user_id: userId,
        start_date: convertDateFormat(profileData.startDate),
        start_weight: profileData.startWeight,
        target_weight: profileData.targetWeight,
        is_active: true,
      });
      console.log(`✅ Created profile: ${profile.id}\n`);
    }

    // 6. Prepare entries data
    console.log(`📥 Preparing ${profileData.data.length} entries...`);
    const entries = profileData.data.map((entry) => ({
      profile_id: profile.id,
      entry_date: convertDateFormat(entry.date),
      weight: entry.weight,
      weight_change: entry.change || 0,
      total_lost: entry.lost || 0,
      target_weight: entry.target,
      slimmer_of_week: entry.sotw || null,
      notes: null,
    }));

    // 7. Delete existing entries for this profile (for clean re-import)
    console.log("🗑️  Removing existing entries for clean import...");
    const existingEntries = await dbService.getSlimmingWorldEntries(profile.id);
    for (const entry of existingEntries) {
      await dbService.deleteSlimmingWorldEntry(entry.id);
    }
    console.log(`✅ Removed ${existingEntries.length} existing entries\n`);

    // 8. Bulk insert entries
    console.log(`📥 Inserting ${entries.length} entries to Supabase...`);
    const insertedEntries =
      await dbService.bulkInsertSlimmingWorldEntries(entries);
    console.log(`✅ Successfully inserted ${insertedEntries.length} entries\n`);

    // 9. Verify the data
    console.log("🔍 Verifying data...");
    const allEntries = await dbService.getSlimmingWorldEntries(profile.id);
    console.log(`✅ Found ${allEntries.length} entries in database\n`);

    // 10. Get latest entry
    const latestEntry = await dbService.getLatestSlimmingWorldEntry(profile.id);
    if (latestEntry) {
      console.log("📊 Latest Entry:");
      console.log(`   Date: ${latestEntry.entry_date}`);
      console.log(`   Weight: ${latestEntry.weight} lbs`);
      console.log(`   Total Lost: ${latestEntry.total_lost} lbs`);
      console.log(
        `   Remaining: ${(profile.target_weight - latestEntry.weight).toFixed(1)} lbs`,
      );
    }

    // 11. Get profile stats
    console.log("\n📊 Profile Statistics:");
    const stats = await dbService.getSlimmingWorldProfileStats(userId);
    if (stats) {
      console.log(`   Total Entries: ${stats.total_entries}`);
      console.log(`   Last Weigh-in: ${stats.last_weigh_in}`);
      console.log(`   Lowest Weight: ${stats.lowest_weight} lbs`);
      console.log(`   Max Lost: ${stats.max_lost} lbs`);
      console.log(`   SOTW Awards: ${stats.total_sotw_awards}`);
    }

    // 12. Get complete profile with entries
    console.log("\n🔍 Testing full data retrieval...");
    const fullProfile =
      await dbService.getSlimmingWorldProfileWithEntries(userId);
    console.log(
      `✅ Retrieved profile with ${fullProfile.entries.length} entries\n`,
    );

    console.log("✅ Migration completed successfully!");
    console.log("\n📝 Next Steps:");
    console.log("   1. Update SlimmingWorld.tsx to fetch from Supabase");
    console.log("   2. Test the page displays correctly");
    console.log("   3. Consider backing up the JSON file");
    console.log("   4. Add new entries via the database going forward\n");
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
    console.error("Stack trace:", error.stack);
    if (error.details) console.error("   Details:", error.details);
    if (error.hint) console.error("   Hint:", error.hint);
    process.exit(1);
  }
}

// Run the migration
migrateSlimmingWorldData();
