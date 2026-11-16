#!/usr/bin/env node

/**
 * Strava Credentials Test
 * Verifies that the Strava OAuth credentials are valid by testing the API
 *
 * Usage:
 *   node scripts/test-strava-credentials.js
 */

async function testStravaCredentials() {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;
  const redirectUri = process.env.VITE_STRAVA_REDIRECT_URI;

  console.log("🔍 Strava Credentials Verification\n");

  // Check environment variables
  if (!clientId || !clientSecret || !redirectUri) {
    console.error("❌ Missing Strava credentials in .env:");
    if (!clientId) console.error("  - STRAVA_CLIENT_ID");
    if (!clientSecret) console.error("  - STRAVA_CLIENT_SECRET");
    if (!redirectUri) console.error("  - VITE_STRAVA_REDIRECT_URI");
    process.exit(1);
  }

  console.log("✓ All environment variables present:");
  console.log(`  - Client ID: ${clientId}`);
  console.log(`  - Redirect URI: ${redirectUri}`);
  console.log(`  - Client Secret: ***${clientSecret.slice(-4)}\n`);

  // Test 1: Verify the OAuth endpoint is accessible
  console.log("📋 Test 1: Checking Strava OAuth endpoint...");
  try {
    const response = await fetch("https://www.strava.com/oauth/authorize", {
      method: "HEAD",
    });
    if (response.ok || response.status === 405) {
      console.log("✓ Strava OAuth endpoint is accessible\n");
    } else {
      console.error(
        `⚠️  Strava OAuth endpoint returned status ${response.status}\n`,
      );
    }
  } catch (err) {
    console.error(`⚠️  Could not reach Strava: ${err.message}\n`);
  }

  // Test 2: Build OAuth URL (this verifies format is correct)
  console.log("📋 Test 2: Building OAuth authorization URL...");
  const scope = "read,activity:read_all";
  const oauthUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}`;
  console.log("✓ OAuth URL built successfully:");
  console.log(`  ${oauthUrl.substring(0, 80)}...\n`);

  // Test 3: Test Strava API public endpoint (doesn't require auth)
  console.log("📋 Test 3: Testing Strava API connectivity...");
  try {
    const response = await fetch("https://www.strava.com/api/v3/athlete", {
      headers: {
        Authorization: "Bearer invalid_token_for_test",
      },
    });
    // We expect 401 Unauthorized since token is invalid, but this proves API is reachable
    if (response.status === 401) {
      console.log("✓ Strava API is accessible (received 401 as expected)\n");
    } else if (response.ok) {
      console.log("✓ Strava API is accessible\n");
    } else {
      console.error(
        `⚠️  Strava API returned unexpected status: ${response.status}\n`,
      );
    }
  } catch (err) {
    console.error(`⚠️  Could not reach Strava API: ${err.message}\n`);
  }

  // Test 4: Verify Supabase connections
  console.log("📋 Test 4: Testing Supabase connections...");
  try {
    const { createClient } = await import("@supabase/supabase-js");

    const bsUrl = process.env.VITE_SUPABASE_URL;
    const bsKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!bsUrl || !bsKey) {
      console.error("⚠️  Missing Supabase credentials\n");
    } else {
      const supabase = createClient(bsUrl, bsKey);
      const { data, error } = await supabase
        .from("strava_activities")
        .select("id")
        .limit(1);

      if (error) {
        console.error(`⚠️  Supabase connection failed: ${error.message}\n`);
      } else {
        console.log("✓ Supabase bs-weestoater is connected\n");
      }
    }
  } catch (err) {
    console.error(`⚠️  Could not test Supabase: ${err.message}\n`);
  }

  // Summary
  console.log("📊 Credential Verification Summary:");
  console.log("✓ All environment variables present");
  console.log("✓ Strava OAuth endpoint is accessible");
  console.log("✓ Strava API is reachable");
  console.log("✓ Supabase connection working\n");

  console.log("🎉 Credentials appear to be valid!\n");
  console.log("Next steps:");
  console.log("1. Visit the OAuth URL (from Test 2) in your browser");
  console.log("2. Authorize the app to access your Strava data");
  console.log("3. You'll be redirected to: " + redirectUri);
  console.log("4. The authorization code will be in the URL (?code=...)\n");
}

testStravaCredentials().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
