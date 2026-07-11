/**
 * Migration script to populate site_config table
 * with current site information
 */

import dotenv from "dotenv";
dotenv.config();

import { getSupabaseClient } from "../index.js";

const { createSiteConfigService } = await import("../index.js");

// Current site configuration
const siteConfigData = {
  site_name: "weestoater",
  site_tagline: "Front-end Development & Accessibility",
  site_description:
    "Portfolio of Ian Burrett - Web Developer specializing in React, TypeScript, and accessible web design",
  email: null, // Add if you want to make this public
  social_links: {
    // github: "https://github.com/weestoater",
    // linkedin: "https://linkedin.com/in/yourusername",
    // twitter: "https://twitter.com/yourusername",
  },
  default_og_image: null, // Can be added later
  google_analytics_id: null,
  google_site_verification: null,
  enable_search: false,
  enable_comments: false,
  maintenance_mode: false,
  maintenance_message:
    "We're currently performing maintenance. Please check back soon!",
  default_theme: "light",
  allowed_themes: ["light", "dark", "high-contrast", "gov-uk"],
  footer_text:
    "© 2026 Ian Burrett. Built with React, TypeScript, and Supabase.",
  footer_links: [
    // { label: "Privacy Policy", path: "/privacy" },
    // { label: "Terms of Service", path: "/terms" },
  ],
};

async function migrateSiteConfig() {
  console.log("🚀 Starting site configuration migration...");

  const client = getSupabaseClient();
  const siteConfigService = createSiteConfigService(client);

  try {
    // Check if site config already exists
    let existing;
    try {
      existing = await siteConfigService.getSiteConfig();
    } catch (error) {
      // Config doesn't exist yet
      existing = null;
    }

    if (existing) {
      console.log("⚠️  Site configuration already exists.");
      console.log("Current config:");
      console.log(`  - Site Name: ${existing.site_name}`);
      console.log(`  - Tagline: ${existing.site_tagline || "Not set"}`);
      console.log(`  - Theme: ${existing.default_theme}`);
      console.log(
        `  - Maintenance Mode: ${existing.maintenance_mode ? "ON" : "OFF"}`,
      );
      console.log(
        "\nTo update configuration, use the admin settings page at /admin/settings",
      );
      return;
    }

    // Initialize site config
    console.log("📝 Creating site configuration...");
    const created =
      await siteConfigService.initializeSiteConfig(siteConfigData);

    console.log("✅ Site configuration created successfully!");
    console.log(`  - ID: ${created.id}`);
    console.log(`  - Site Name: ${created.site_name}`);
    console.log(`  - Tagline: ${created.site_tagline}`);
    console.log(`  - Default Theme: ${created.default_theme}`);

    console.log("\n✨ Migration complete!");
    console.log("\n🎯 Next steps:");
    console.log("1. Visit /admin/settings to manage site configuration");
    console.log("2. Upload logo and favicon");
    console.log("3. Configure social media links");
    console.log("4. Set up Google Analytics (if desired)");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

// Run migration
migrateSiteConfig()
  .then(() => {
    console.log("\n✅ All done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Fatal error:", error);
    process.exit(1);
  });
