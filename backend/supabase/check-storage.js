/**
 * Check and report on Supabase Storage setup for weeCMS
 * Run this to verify your storage bucket is properly configured
 */

import dotenv from "dotenv";
dotenv.config();

import { getSupabaseClient } from "../index.js";

async function checkStorage() {
  console.log("🔍 Checking Supabase Storage setup...\n");

  try {
    const supabase = getSupabaseClient();

    // Check if images bucket exists
    console.log("📁 Checking 'images' bucket...");
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error("❌ Error listing buckets:", bucketsError);
      return;
    }

    const imagesBucket = buckets.find((b) => b.id === "images");

    if (!imagesBucket) {
      console.log("❌ 'images' bucket NOT FOUND\n");
      console.log("📝 To create the bucket:");
      console.log("   1. Go to https://supabase.com/dashboard");
      console.log("   2. Navigate to your project: huqmjtxwlybjtmouwgaz");
      console.log("   3. Click 'Storage' in the left sidebar");
      console.log("   4. Click 'New bucket'");
      console.log("   5. Name: images");
      console.log("   6. Enable 'Public bucket'");
      console.log("   7. Set file size limit: 10485760 (10MB)");
      console.log("   8. Click 'Create bucket'\n");
      return;
    }

    console.log("✅ 'images' bucket exists");
    console.log(`   - Public: ${imagesBucket.public ? "✅ Yes" : "❌ No"}`);
    console.log(
      `   - File size limit: ${imagesBucket.file_size_limit ? imagesBucket.file_size_limit + " bytes" : "Not set"}`,
    );
    console.log(
      `   - Allowed MIME types: ${imagesBucket.allowed_mime_types?.join(", ") || "All"}`,
    );

    if (!imagesBucket.public) {
      console.log("\n⚠️  WARNING: Bucket should be PUBLIC!");
      console.log("   To fix:");
      console.log("   1. Go to Storage in Supabase Dashboard");
      console.log("   2. Click gear icon next to 'images' bucket");
      console.log("   3. Check 'Public bucket'");
      console.log("   4. Save");
    }

    // Test file list (to verify policies)
    console.log("\n📋 Testing storage access...");
    const { data: files, error: filesError } = await supabase.storage
      .from("images")
      .list("", {
        limit: 5,
        offset: 0,
      });

    if (filesError) {
      console.error("❌ Error listing files:", filesError);
      console.log("\n⚠️  This might mean storage policies need to be set up.");
      console.log("   Run the SQL file:");
      console.log("   backend/supabase/weecms-storage-setup.sql");
    } else {
      console.log("✅ Storage access working");
      console.log(`   - Files in bucket: ${files.length} (showing up to 5)`);
      if (files.length > 0) {
        files.forEach((file) => {
          console.log(`     - ${file.name}`);
        });
      }
    }

    // Check media_library table
    console.log("\n🗄️  Checking media_library table...");
    const { data: mediaItems, error: mediaError } = await supabase
      .from("media_library")
      .select("id")
      .limit(1);

    if (mediaError) {
      console.error("❌ Error accessing media_library table:", mediaError);
      console.log(
        "\n⚠️  The media_library table might not exist or have RLS issues.",
      );
      console.log("   Make sure you've run:");
      console.log("   backend/supabase/weecms-schema.sql");
    } else {
      console.log("✅ media_library table accessible");
    }

    console.log("\n✅ Storage check complete!");
    console.log("\n📝 Next steps:");
    console.log("   1. Run weecms-storage-setup.sql in Supabase SQL Editor");
    console.log("      (Sets up RLS policies for storage)");
    console.log("   2. Test upload from /admin/media in your app");
    console.log(
      "   3. Check that uploads appear in both Storage and media_library table",
    );
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

checkStorage();
