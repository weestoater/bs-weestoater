# BS WeeStaater Backend

Backend services and database configuration for the BS WeeStaater website. This package provides a clean, organized way to manage Supabase integration for the books content and other site data.

## 📁 Structure

```
backend/
├── index.js                  # Main entry point - exports all modules
├── package.json              # Package configuration and dependencies
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
└── supabase/                 # Supabase integration
    ├── client.js             # Supabase client factory
    ├── config.js             # Configuration validation and loading
    ├── database.js           # Database operations (CRUD for books)
    ├── schema.sql            # Database schema and seed data
    └── migrate-books.js      # Migration script for book content
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

Or from the project root:

```bash
npm install --prefix backend
```

### 2. Set Up Environment Variables

Create a `.env` file in your **project root** (not in the backend folder):

```env
# For Vite projects (frontend)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> **Note:** The `.env` file should be in the project root (`d:\git\bs-weestoater\.env`), not in the backend folder, so that Vite can access it.

### 3. Set Up the Database

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Open and run `backend/supabase/schema.sql`

This will:

- Create the `books` table
- Set up Row Level Security (RLS) policies
- Add triggers for automatic timestamp updates
- Optionally insert seed data for the three books

### 4. Migrate Book Content

Run the migration script to populate the database:

```bash
cd backend
node supabase/migrate-books.js
```

Or from the project root:

```bash
node backend/supabase/migrate-books.js
```

## 📖 Usage

### In Your React/Vite App

```javascript
// Import the Supabase client
import { getSupabaseClient } from "./backend/index.js";
import { createDatabaseService } from "./backend/index.js";

// Get the client instance
const supabase = getSupabaseClient();

// Create database service
const db = createDatabaseService(supabase);

// Fetch all books
const books = await db.getBooks();

// Get a specific book
const book = await db.getBookById("afe");

// Create a new book (requires authentication)
await db.createBook({
  id: "new-book",
  title: "My New Book",
  author: "John Doe",
  cover_image: "/assets/img/new-book.jpg",
  description: "<p>Book description here...</p>",
  order_index: 4,
  published: true,
});
```

### Using in a Component

```jsx
import { useEffect, useState } from "react";
import { getSupabaseClient } from "../backend/index.js";
import { createDatabaseService } from "../backend/index.js";

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const supabase = getSupabaseClient();
        const db = createDatabaseService(supabase);
        const data = await db.getBooks();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {books.map((book) => (
        <div key={book.id}>
          <h2>{book.title}</h2>
          <p>by {book.author}</p>
          <div dangerouslySetInnerHTML={{ __html: book.description }} />
        </div>
      ))}
    </div>
  );
}
```

## 🗄️ Database Operations

The `database.js` module provides these methods:

### Books Operations

- `getBooks(options)` - Get all published books (or include unpublished with options)
- `getBookById(id)` - Get a single book by ID
- `createBook(bookData)` - Create a new book
- `updateBook(id, bookData)` - Update an existing book
- `deleteBook(id)` - Delete a book
- `bulkInsertBooks(books)` - Insert multiple books at once
- `updateBooksOrder(orderUpdates)` - Update display order of books

## 🔐 Security

### Row Level Security (RLS)

The books table has RLS enabled with the following policies:

- **Public Read Access**: Anyone can read published books
- **Admin Write Access**: Only authenticated users can create, update, or delete books

> **Important:** In production, you should restrict write access to users with an admin role. The current setup allows any authenticated user to manage books.

### Updating RLS Policies for Admin-Only Access

To restrict write access to admins only, modify the schema.sql policies:

```sql
-- Example: Restrict to admin role
CREATE POLICY "Only admins can insert books"
  ON books FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');
```

## 🔧 Configuration

### Environment Variables

The configuration supports multiple environment variable formats:

**For Vite (Recommended):**

```env
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-key
```

**For Node.js scripts:**

```env
SUPABASE_URL=your-url
SUPABASE_ANON_KEY=your-key
```

The system will automatically try both formats.

### Debug Mode

Enable debug logging to troubleshoot connection issues:

```javascript
import { getSupabaseClient } from "./backend/index.js";

// Enable debug mode
const supabase = getSupabaseClient(null, true);
```

## 📊 Database Schema

### Books Table

| Column        | Type        | Description                          |
| ------------- | ----------- | ------------------------------------ |
| `id`          | TEXT        | Primary key (slug, e.g., 'afe')      |
| `title`       | TEXT        | Book title                           |
| `author`      | TEXT        | Author name                          |
| `cover_image` | TEXT        | Cover image URL/path                 |
| `description` | TEXT        | HTML description                     |
| `order_index` | INTEGER     | Display order (default: 0)           |
| `published`   | BOOLEAN     | Published status (default: true)     |
| `created_at`  | TIMESTAMPTZ | Creation timestamp                   |
| `updated_at`  | TIMESTAMPTZ | Last update timestamp (auto-updated) |

## 📝 TypeScript Support

TypeScript definitions will be added in a future update. For now, you can create a `types.d.ts` file:

```typescript
export interface Book {
  id: string;
  title: string;
  author: string;
  cover_image: string;
  description: string;
  order_index: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}
```

## 🧪 Testing

To test the connection:

```javascript
import { getSupabaseClient, debugConfig } from "./backend/index.js";

// Test configuration
const supabase = getSupabaseClient(null, true);

// Try to fetch books
const { data, error } = await supabase.from("books").select("*");
console.log("Books:", data);
console.log("Error:", error);
```

## 🔄 Migration

The migration script (`migrate-books.js`) handles:

1. Reading book data from the script
2. Checking for existing books
3. Creating new books or updating existing ones
4. Providing a detailed summary

To customize the migration, edit the `booksData` array in `migrate-books.js`.

## 📚 Next Steps

1. **Add Authentication**: Implement Supabase auth to secure write operations
2. **Add More Tables**: Extend the schema for other content types (articles, projects, etc.)
3. **Add TypeScript**: Create comprehensive type definitions
4. **Add Tests**: Set up unit and integration tests
5. **Add Admin UI**: Create an admin interface for managing books

## 🆘 Troubleshooting

### "Unable to load environment variables"

- Ensure `.env` file exists in the project root
- Check that variable names match exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart your dev server after adding/changing environment variables

### "No rows returned"

- Check that the schema.sql has been run in your Supabase project
- Verify RLS policies are correctly configured
- Try running the migration script to add seed data

### Connection Errors

- Verify your Supabase URL and anon key are correct
- Check that your Supabase project is active
- Enable debug mode to see detailed connection info

## 📄 License

MIT - See LICENSE file in project root
