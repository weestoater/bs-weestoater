/**
 * Quick test script to verify Supabase connection
 * Run: node test-supabase-connection.js
 */

import { getSupabaseClient } from "./backend/index.js";
import { createDatabaseService } from "./backend/index.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function testConnection() {
  console.log("🔧 Testing Supabase Connection...\n");

  try {
    // Test 1: Check environment variables
    console.log("📋 Step 1: Checking environment variables...");
    const url = process.env.VITE_SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_ANON_KEY;

    if (!url || !key) {
      console.error("❌ Environment variables not found!");
      console.log("   Please ensure .env file exists in project root");
      process.exit(1);
    }
    console.log(`   ✅ VITE_SUPABASE_URL: ${url}`);
    console.log(`   ✅ VITE_SUPABASE_ANON_KEY: ${key.substring(0, 20)}...`);
    console.log("");

    // Test 2: Create Supabase client
    console.log("📋 Step 2: Creating Supabase client...");
    const supabase = getSupabaseClient(null, true);
    console.log("   ✅ Client created successfully\n");

    // Test 3: Test database connection
    console.log("📋 Step 3: Testing database connection...");
    const { data: testData, error: testError } = await supabase
      .from("books")
      .select("count");

    if (testError) {
      console.error("   ❌ Database connection failed:", testError.message);
      if (testError.message.includes('relation "books" does not exist')) {
        console.log("\n💡 The books table doesn't exist yet.");
        console.log("   Run the schema.sql in Supabase SQL Editor first.");
      }
    } else {
      console.log("   ✅ Database connection successful\n");

      // Test 4: Fetch books
      console.log("📋 Step 4: Fetching books from database...");
      const db = createDatabaseService(supabase);
      const books = await db.getBooks();

      if (books.length === 0) {
        console.log("   ⚠️  No books found in database");
        console.log("   Run: node backend/supabase/migrate-books.js");
      } else {
        console.log(`   ✅ Found ${books.length} book(s):\n`);
        books.forEach((book) => {
          console.log(`      📖 ${book.title}`);
          console.log(`         by ${book.author}`);
          console.log(`         ID: ${book.id}\n`);
        });
      }
    }

    console.log("🎉 Connection test complete!\n");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error("\nFull error:", error);
    process.exit(1);
  }
}

testConnection();
