# BS WeeStaater - Supabase Setup Guide

This guide walks you through setting up Supabase integration for your BS WeeStaater website from scratch.

## Prerequisites

- A Supabase account (free tier is fine)
- Node.js installed on your system
- Your BS WeeStaater project

## Step-by-Step Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in:
   - **Name**: bs-weestoater (or your preferred name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose the closest to your users
5. Click "Create new project"
6. Wait for the project to initialize (1-2 minutes)

### 2. Get Your API Keys

1. In your Supabase project dashboard, click on **Settings** (gear icon)
2. Navigate to **API** in the sidebar
3. Copy these two values:
   - **Project URL** (e.g., `https://abcdefghijk.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

### 3. Configure Environment Variables

1. In your project root (`d:\git\bs-weestoater\`), create a `.env` file
2. Add your credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file

> **Important:** Never commit this file to Git! It's already in `.gitignore`.

### 4. Install Backend Dependencies

```bash
cd backend
npm install
```

Or from project root:

```bash
npm install --prefix backend
```

This installs:

- `@supabase/supabase-js` - Supabase JavaScript client
- `dotenv` - Environment variable loader

### 5. Set Up the Database

1. In Supabase dashboard, click **SQL Editor** in the sidebar
2. Click **New query**
3. Open `backend/supabase/schema.sql` in your code editor
4. Copy the entire contents
5. Paste into the Supabase SQL Editor
6. Click **Run** (or press Ctrl+Enter)

You should see: **Success. No rows returned**

This creates:

- The `books` table
- Row Level Security policies
- Automatic timestamp triggers
- Three seed books (AFE, CZG, DWWS)

### 6. Verify the Setup

In the Supabase dashboard:

1. Click **Table Editor** in the sidebar
2. Select the `books` table
3. You should see 3 rows with your book data

### 7. Run the Migration (Optional)

If the seed data didn't load, run the migration script:

```bash
cd backend
node supabase/migrate-books.js
```

You should see:

```
✅ Migration complete!
📊 Summary:
   - Created: 3
   - Updated: 0
   - Skipped: 0
```

### 8. Test the Connection

Create a test file to verify everything works:

**test-connection.js** (in project root):

```javascript
import { getSupabaseClient } from "./backend/index.js";
import { createDatabaseService } from "./backend/index.js";

async function test() {
  try {
    console.log("Testing Supabase connection...\n");

    const supabase = getSupabaseClient(null, true);
    const db = createDatabaseService(supabase);

    const books = await db.getBooks();

    console.log(`✅ Success! Found ${books.length} books:\n`);
    books.forEach((book) => {
      console.log(`  📖 ${book.title} by ${book.author}`);
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

test();
```

Run it:

```bash
node test-connection.js
```

Expected output:

```
Testing Supabase connection...
✅ Success! Found 3 books:
  📖 Accessibility for Everyone by Laura Kalbag
  📖 The Zen of CSS Design by Dave Shea & Molly E. Holzschlag
  📖 Designing with Web Standards by Jeffrey Zeldman
```

## Next Steps

### Update Your React Components

Instead of using static TSX files, fetch books from Supabase:

```jsx
// Before (static)
import { AFEBook } from "./content/books/afe";

// After (dynamic)
import { useEffect, useState } from "react";
import { getSupabaseClient } from "./backend/index.js";
import { createDatabaseService } from "./backend/index.js";

function Books() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function loadBooks() {
      const supabase = getSupabaseClient();
      const db = createDatabaseService(supabase);
      const data = await db.getBooks();
      setBooks(data);
    }
    loadBooks();
  }, []);

  return (
    <div>
      {books.map((book) => (
        <div key={book.id} className="card">
          <div className="card-header">
            <i className="bi bi-book"></i> {book.title}
          </div>
          <div className="card-body">
            <img src={book.cover_image} alt={`${book.title} cover`} />
            <p>
              <small>by {book.author}</small>
            </p>
            <div dangerouslySetInnerHTML={{ __html: book.description }} />
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Add More Content Types

You can extend this pattern for other content:

1. Add new tables to `schema.sql` (articles, projects, etc.)
2. Add functions to `database.js` for the new tables
3. Create migration scripts as needed

### Set Up Authentication (Optional)

If you want to add an admin panel to manage content:

1. Enable Email auth in Supabase dashboard
2. Create an admin user
3. Build a simple admin UI to CRUD books
4. Update RLS policies to restrict to admin users

## Troubleshooting

### Error: "Unable to load environment variables"

**Solution:**

1. Make sure `.env` is in the project root (not in backend/)
2. Verify variable names: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Restart your dev server

### Error: "relation 'books' does not exist"

**Solution:**

- You haven't run the schema.sql yet
- Go to Supabase SQL Editor and run the schema

### Error: "Invalid API key"

**Solution:**

- Double-check your anon key in the `.env` file
- Make sure you copied the **anon public** key, not the service role key
- Verify there are no extra spaces or line breaks

### Books not showing up

**Solution:**

1. Check RLS policies in Supabase dashboard
2. Verify books were inserted: Go to Table Editor > books
3. Check the `published` column is `true`
4. Run the migration script to ensure data is loaded

## Support

For more detailed information, see:

- [backend/README.md](README.md) - Complete backend documentation
- [Supabase Documentation](https://supabase.com/docs)

## Summary

You've successfully:

- ✅ Created a Supabase project
- ✅ Set up environment variables
- ✅ Installed dependencies
- ✅ Created the books table
- ✅ Migrated your book content
- ✅ Tested the connection

Your books content is now managed in Supabase, making it easy to add, edit, or remove books without touching code! 🎉
