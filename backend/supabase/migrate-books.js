/**
 * Books Data Migration Script
 *
 * This script migrates book content from TSX files to Supabase
 *
 * Usage:
 * 1. Set up environment variables for Supabase
 * 2. Run: node backend/supabase/migrate-books.js
 */

import { createSupabaseClient } from "./client.js";
import createDatabaseService from "./database.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// ============================================================================
// BOOK DATA FROM CONTENT FILES
// ============================================================================

const booksData = [
  {
    id: "afe",
    title: "Accessibility for Everyone",
    author: "Laura Kalbag",
    cover_image: "/assets/img/kalbag-AFE-cover.jpg",
    description: `<p>This book is an essential read for anyone involved in creating digital products. Laura Kalbag provides a comprehensive guide to making web content accessible to all users, regardless of their abilities or disabilities.</p>
<p>With a foreword from the incredible <a href="https://heydonworks.com/" target="_blank" rel="noopener noreferrer">Heydon Pickering</a> you know you're in good hands. This isn't a beginners guide by any means, but it certainly one of the best books you can pick up if you have even the slightest intrest in Accessibility.</p>
<p>By understanding the issues people with disabilities and impairments face, you can better advocate for inclusive design and development practices. In the book you'll learn how to plan for, evaluate and test accessible design. Leveraging tools and techniques like good information architecture and meaningful HTML to create a solid basis of best practices.</p>
<p>Like all for the <strong>A Book Apart</strong> publications, this is a joy to read and not at all dry or preaching. Pick up a copy, digital or print and make the web a better place for everyone.</p>`,
    order_index: 1,
    published: true,
  },
  {
    id: "czg",
    title: "The Zen of CSS Design",
    author: "Dave Shea & Molly E. Holzschlag",
    cover_image: "/assets/img/shea-tzocd-cover.jpg",
    description: `<p>This book came about because of the incredibly successfull <a href="http://www.csszengarden.com/" target="_blank" rel="noopener noreferrer">CSS Zen Garden</a> project, which demonstrated the immense power of CSS based design by using a single HTML file styled in multiple ways.</p>
<p>If anyone ever says CSS is boring show them the site, if they want to know how to do it - give them this book. Each chapter outlines a different factor of the process. The typography, layout, imagery, and more are all covered in detail.</p>
<p>It too is written in a clear, engaging style, which leads the reader through the different elements with great clarity and ease. A truely enjoyable and uplifting read for those exploring the world of CSS design.</p>
<p>Written in a time before RWD (Responsive Web Design) became mainstream, it offers timeless insights into CSS design principles. The power of the <em>cascade</em> and inheritance are touched on throughout the book.</p>`,
    order_index: 2,
    published: true,
  },
  {
    id: "dwws",
    title: "Designing with Web Standards",
    author: "Jeffrey Zeldman",
    cover_image: "/assets/img/zeldman-dwws-cover.jpg",
    description: `<p>This is a <strong>must read</strong> for anyone looking to work within the web industry. Whether a designer, developer or project manager, this book covers everything you should be looking for when building internet products.</p>
<p>Breaking down the fundamentals of web standards and best practices, in a light-hearted but informative manner, Zeldman is a masterful storyteller who makes complex concepts accessible and engaging.</p>
<p>Owning both 1st and 3rd editions of this book, I highly recommend it to anyone serious about web standards or just building better websites, ones that won't break on new devices or need constant tweaks and fixes. This is because you'll be building to the same <strong>standards</strong> that device manufacturers use to ensure compatibility and longevity. Not chasing the latest fad or trend for cool hip design. Content is king and the proper semantics make your content available to way more of an audience than the hipsters.</p>
<p>To quote the great Guy Martin:</p>
<blockquote>"Do it right, do it once!<br />If it's not right, it's wrong."</blockquote>`,
    order_index: 3,
    published: true,
  },
];

// ============================================================================
// MIGRATION FUNCTIONS
// ============================================================================

async function migrateBooks() {
  console.log("📚 Starting books migration to Supabase...\n");

  try {
    // Create Supabase client
    const supabase = createSupabaseClient(null, true);
    const db = createDatabaseService(supabase);

    console.log(`📦 Preparing to migrate ${booksData.length} books\n`);

    // Check if books already exist
    console.log("🔍 Checking for existing books...");
    const existingBooks = await db.getBooks({ includeUnpublished: true });
    console.log(`   Found ${existingBooks.length} existing books\n`);

    // Migrate each book
    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const book of booksData) {
      console.log(`📖 Processing: ${book.title}`);

      const existingBook = existingBooks.find((b) => b.id === book.id);

      if (existingBook) {
        console.log(`   ⚠️  Book already exists (id: ${book.id})`);
        console.log(`   🔄 Updating...`);
        try {
          await db.updateBook(book.id, book);
          updated++;
          console.log(`   ✅ Updated successfully\n`);
        } catch (error) {
          console.error(`   ❌ Update failed: ${error.message}\n`);
          skipped++;
        }
      } else {
        console.log(`   ➕ Creating new book...`);
        try {
          await db.createBook(book);
          created++;
          console.log(`   ✅ Created successfully\n`);
        } catch (error) {
          console.error(`   ❌ Creation failed: ${error.message}\n`);
          skipped++;
        }
      }
    }

    console.log("✅ Migration complete!\n");
    console.log("📊 Summary:");
    console.log(`   - Created: ${created}`);
    console.log(`   - Updated: ${updated}`);
    console.log(`   - Skipped: ${skipped}`);
    console.log(`   - Total: ${booksData.length}\n`);

    // Verify the migration
    console.log("🔍 Verifying migration...");
    const allBooks = await db.getBooks({ includeUnpublished: true });
    console.log(`   ✅ Found ${allBooks.length} books in database\n`);

    console.log("🎉 All done!");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    if (error.message.includes("environment variables")) {
      console.log("\n💡 Tips:");
      console.log("   1. Create a .env file in the project root");
      console.log("   2. Add your Supabase credentials:");
      console.log("      VITE_SUPABASE_URL=your-url");
      console.log("      VITE_SUPABASE_ANON_KEY=your-key");
      console.log("   3. Run the migration script again");
    }
    process.exit(1);
  }
}

// ============================================================================
// RUN MIGRATION
// ============================================================================

migrateBooks();
