#!/usr/bin/env node

/**
 * Garmin Connect Activity Sync Script
 *
 * Usage:
 *   node scripts/sync-garmin-activities.js
 *
 * Or with environment variables:
 *   GARMIN_USERNAME=your@email.com GARMIN_PASSWORD=yourpassword node scripts/sync-garmin-activities.js
 *
 * Or add to .env file:
 *   GARMIN_USERNAME=your@email.com
 *   GARMIN_PASSWORD=yourpassword
 */

import GarminSyncService from "../backend/garmin/garminSyncService.js";
import { createSupabaseClient } from "../backend/supabase/client.js";
import dotenv from "dotenv";
import readline from "readline";

// Load environment variables
dotenv.config();

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Prompt for user input
 */
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

/**
 * Prompt for password (hidden input)
 */
function promptPassword(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    let password = "";

    const onData = (char) => {
      // Handle different key presses
      if (char === "\n" || char === "\r" || char === "\u0004") {
        // Enter pressed
        process.stdin.setRawMode(false);
        process.stdin.removeListener("data", onData);
        process.stdout.write("\n");
        resolve(password);
      } else if (char === "\u0003") {
        // Ctrl+C pressed
        process.exit();
      } else if (char === "\u007f") {
        // Backspace pressed
        if (password.length > 0) {
          password = password.slice(0, -1);
          process.stdout.write("\b \b");
        }
      } else {
        // Normal character
        password += char;
        process.stdout.write("*");
      }
    };

    process.stdin.on("data", onData);
  });
}

/**
 * Main sync function
 */
async function main() {
  console.log("🏃 Garmin Connect Activity Sync");
  console.log("================================\n");

  try {
    // Get credentials
    let username = process.env.GARMIN_USERNAME;
    let password = process.env.GARMIN_PASSWORD;

    if (!username) {
      username = await prompt("Garmin Connect Email: ");
    }

    if (!password) {
      password = await promptPassword("Garmin Connect Password: ");
    }

    if (!username || !password) {
      console.error("\n❌ Username and password are required");
      process.exit(1);
    }

    // Get activity limit
    const limitInput = await prompt(
      "\nHow many recent activities to sync? (default: 20): ",
    );
    const limit = parseInt(limitInput) || 20;

    // Ask if including GPS data
    const includeGPSInput = await prompt(
      "\nInclude GPS tracking data? (slower, y/N): ",
    );
    const includeGPS =
      includeGPSInput.toLowerCase() === "y" ||
      includeGPSInput.toLowerCase() === "yes";

    if (includeGPS) {
      console.log("\n📍 GPS data will be fetched (this will take longer)...");
    }

    // Ask if syncing to Supabase
    const syncToSupabaseInput = await prompt(
      "\nSync to Supabase database? (y/N): ",
    );
    const syncToSupabase =
      syncToSupabaseInput.toLowerCase() === "y" ||
      syncToSupabaseInput.toLowerCase() === "yes";

    let supabaseClient = null;
    if (syncToSupabase) {
      // Check for Supabase credentials
      const supabaseUrl =
        process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
      const supabaseKey =
        process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        console.log("\n⚠️  Warning: Supabase credentials not found in .env");
        console.log(
          "   Skipping Supabase sync. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable.\n",
        );
      } else {
        console.log("\n🔌 Connecting to Supabase...");
        supabaseClient = createSupabaseClient({
          url: supabaseUrl,
          anonKey: supabaseKey,
        });
        console.log("✅ Connected to Supabase");
      }
    }

    console.log(`\n⏳ Syncing ${limit} activities...\n`);

    // Create sync service and sync
    const syncService = new GarminSyncService(username, password);
    const result = await syncService.syncActivities(limit, {
      saveToJson: true,
      includeGPS: includeGPS,
      supabaseClient: supabaseClient,
    });

    if (result.success) {
      console.log("\n✅ Sync completed successfully!");
      if (result.filePath) {
        console.log(`\n📁 Activities saved to: ${result.filePath}`);
      }
      if (result.supabaseSaved) {
        console.log("💾 Activities synced to Supabase database");
      }
    } else {
      console.error(`\n❌ Sync failed: ${result.error}\n`);
      process.exit(1);
    }

    // Ask if also syncing daily steps
    const syncDailyStepsInput = await prompt(
      "\nAlso sync daily steps data? (y/N): ",
    );
    const syncDailySteps =
      syncDailyStepsInput.toLowerCase() === "y" ||
      syncDailyStepsInput.toLowerCase() === "yes";

    if (syncDailySteps) {
      const daysInput = await prompt(
        "\nHow many days of step data to sync? (default: 30): ",
      );
      const days = parseInt(daysInput) || 30;

      console.log(`\n⏳ Syncing ${days} days of step data...\n`);

      const stepsResult = await syncService.syncDailySteps(days, {
        saveToJson: true,
        supabaseClient: supabaseClient,
      });

      if (stepsResult.success) {
        console.log("\n✅ Daily steps sync completed successfully!");
        if (stepsResult.filePath) {
          console.log(`\n📁 Daily steps saved to: ${stepsResult.filePath}`);
        }
        if (stepsResult.supabaseSaved) {
          console.log("💾 Daily steps synced to Supabase database");
        }
      } else {
        console.error(`\n⚠️  Daily steps sync failed: ${stepsResult.error}`);
      }
    }

    console.log(
      "\n💡 Tip: You can add GARMIN_USERNAME and GARMIN_PASSWORD to your .env file",
    );
    console.log("   to avoid entering credentials each time.\n");
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}\n`);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the script
main();
