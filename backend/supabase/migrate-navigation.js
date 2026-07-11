/**
 * Migration script to populate navigation_items table
 * with current hard-coded navigation structure
 */

import dotenv from "dotenv";
dotenv.config();

import { getSupabaseClient } from "../index.js";

const { createNavigationService } = await import("../index.js");

// Current navigation items from appheader.tsx
const navigationData = [
  {
    label: "Home",
    path: "/home",
    icon: "bi-house-fill",
    order_index: 1,
    visible: true,
    require_auth: false,
    external: false,
    new_window: false,
  },
  {
    label: "About",
    path: "/about",
    icon: "bi-person-badge",
    order_index: 2,
    visible: true,
    require_auth: false,
    external: false,
    new_window: false,
  },
  {
    label: "A11y",
    path: "/a11y",
    icon: "bi-universal-access-circle",
    order_index: 3,
    visible: true,
    require_auth: false,
    external: false,
    new_window: false,
  },
  {
    label: "Agile",
    path: "/agile",
    icon: "bi-lightning-fill",
    order_index: 4,
    visible: true,
    require_auth: false,
    external: false,
    new_window: false,
  },
  {
    label: "Books",
    path: "/books",
    icon: "bi-book",
    order_index: 5,
    visible: true,
    require_auth: false,
    external: false,
    new_window: false,
  },
  {
    label: "Football",
    path: "/football",
    icon: "bi-trophy",
    order_index: 6,
    visible: true,
    require_auth: false,
    external: false,
    new_window: false,
  },
  {
    label: "Landie",
    path: "/landie",
    icon: "bi-newspaper",
    order_index: 7,
    visible: true,
    require_auth: false,
    external: false,
    new_window: false,
  },
  {
    label: "React",
    path: "/react",
    icon: "bi-code-slash",
    order_index: 8,
    visible: true,
    require_auth: false,
    external: false,
    new_window: false,
  },
  {
    label: "SW",
    path: "/sw",
    icon: "bi-heart-pulse",
    order_index: 9,
    visible: true,
    require_auth: false,
    external: false,
    new_window: false,
  },
];

async function migrateNavigation() {
  console.log("🚀 Starting navigation migration...");

  const client = getSupabaseClient();
  const navigationService = createNavigationService(client);

  try {
    // Check if navigation items already exist
    const existing = await navigationService.getNavigationItems({
      includeHidden: true,
    });

    if (existing && existing.length > 0) {
      console.log(`⚠️  Found ${existing.length} existing navigation items.`);
      console.log("Do you want to:");
      console.log("1. Skip migration (keep existing data)");
      console.log("2. Delete and recreate (DESTRUCTIVE)");
      console.log("\nTo recreate, manually delete items first, then re-run.");
      return;
    }

    // Insert navigation items
    console.log(`📝 Creating ${navigationData.length} navigation items...`);

    for (const item of navigationData) {
      const created = await navigationService.createNavigationItem(item);
      console.log(`✅ Created: ${item.label} (${created.id})`);
    }

    console.log("\n✨ Migration complete!");
    console.log(`📊 Created ${navigationData.length} navigation items`);
    console.log("\n🎯 Next steps:");
    console.log("1. Visit /admin/navigation to manage navigation");
    console.log("2. Update Header component to use database navigation");
    console.log("3. Test navigation on the site");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

// Run migration
migrateNavigation()
  .then(() => {
    console.log("\n✅ All done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  });
