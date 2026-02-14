# Admin Interface

Simple content management system (CMS) for BS WeeStaater built with Supabase Auth and React Router.

## Features

- 🔐 **Authentication**: Secure login using Supabase Auth
- 📚 **Books Management**: Full CRUD operations for book content
- 🎨 **Live Preview**: See changes as you edit
- 🛡️ **Protected Routes**: Admin pages require authentication
- 📱 **Responsive Design**: Works on all devices with Bootstrap

## Getting Started

### Prerequisites

1. Supabase project configured (see backend/SETUP_GUIDE.md)
2. Admin user created in Supabase Auth dashboard

### Creating an Admin User

1. Go to your Supabase dashboard
2. Navigate to Authentication > Users
3. Click "Add user"
4. Enter email and password
5. Confirm the user (or set up email confirmation)

### Accessing the Admin Panel

Navigate to: `#/admin/login`

Example: `http://localhost:3000/#/admin/login`

## Routes

- `/admin/login` - Login page (public)
- `/admin` - Dashboard (protected)
- `/admin/books` - Books list (protected)
- `/admin/books/new` - Create new book (protected)
- `/admin/books/edit/:id` - Edit existing book (protected)

## File Structure

```
src/
├── hooks/
│   └── useAuth.ts                    # Authentication hook
├── components/
│   └── admin/
│       └── ProtectedRoute.tsx        # Route protection wrapper
└── pages/
    └── admin/
        ├── AdminLogin.tsx            # Login page
        ├── AdminDashboard.tsx        # Main dashboard
        ├── BooksManager.tsx          # Books list view
        └── BookEditor.tsx            # Book create/edit form
```

## How It Works

### Authentication Flow

1. User enters credentials on login page
2. `useAuth` hook calls Supabase Auth
3. Session stored in browser
4. `ProtectedRoute` checks authentication
5. Redirects to login if not authenticated

### Books Management

- **List View**: Display all books (published and draft)
- **Create**: Add new book with form validation
- **Edit**: Update existing book details with rich text editor
- **Rich Text Editor**: TinyMCE WYSIWYG editor for book descriptions
- **Toggle Published**: Quick publish/unpublish
- **Delete**: Remove book with confirmation
- **Preview**: Side-by-side HTML preview while editing

### State Management

- **Loading States**: Show spinners during async operations
- **Error Handling**: Display user-friendly error messages
- **Optimistic Updates**: Reload data after mutations
- **Form Validation**: Required fields and type checking

### Rich Text Editor

The admin interface uses **TinyMCE** for book descriptions:

- **WYSIWYG Editing**: What you see is what you get
- **Formatting Tools**: Bold, italic, headings, lists
- **Link Support**: Add hyperlinks to external resources
- **Code View**: Switch to HTML code for advanced editing
- **Live Preview**: See formatted HTML in real-time preview pane

**Available Toolbar:**

- Text formatting (bold, italic, color)
- Alignment (left, center, right, justify)
- Lists (bullets, numbers, indent)
- Insert links
- Undo/redo
- HTML code view

## API Usage

The admin interface uses the backend database service:

```typescript
import { getSupabaseClient } from "../../backend/index.js";

const { createDatabaseService } = await import("../../backend/index.js");

const client = getSupabaseClient();
const db = createDatabaseService(client);

// Fetch all books (including unpublished)
const books = await db.getBooks({ includeUnpublished: true });

// Get single book
const book = await db.getBookById(id);

// Create book
const newBook = await db.createBook(bookData);

// Update book
const updated = await db.updateBook(id, changes);

// Delete book
await db.deleteBook(id);
```

## Security

- ✅ Authentication required for all admin routes
- ✅ Supabase RLS policies enforce database-level security
- ✅ Session tokens stored securely in browser
- ✅ HTTPS enforced in production
- ✅ CORS configured properly

## Future Enhancements

### Coming Soon

- 📝 **Articles Management**: Create and edit blog posts
- 🖼️ **Media Library**: Upload and manage images
- 👥 **User Roles**: Different permission levels
- 📊 **Analytics Dashboard**: View content stats
- 🔍 **Search & Filter**: Find content quickly
- 📅 **Scheduled Publishing**: Set publish dates
- 🎨 **Rich Text Editor**: Better content editing
- 🌐 **Multi-language Support**: Internationalization

### Planned Features

- Bulk operations (publish/delete multiple items)
- Content versioning and history
- Preview before publishing
- SEO metadata management
- Image optimization and CDN integration
- Import/export content

## Development

### Adding New Content Types

1. Create database schema in `backend/supabase/schema.sql`
2. Add CRUD methods to `backend/supabase/database.js`
3. Update TypeScript types
4. Create list view component
5. Create editor component
6. Add routes to App.tsx
7. Add dashboard card

Example structure:

```typescript
// src/pages/admin/ArticlesManager.tsx
export const ArticlesManager = () => {
  const [articles, setArticles] = useState([]);
  // ... fetch and display logic
};

// src/pages/admin/ArticleEditor.tsx
export const ArticleEditor = () => {
  const [formData, setFormData] = useState({});
  // ... form handling logic
};
```

### Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## Troubleshooting

### "Cannot find module '@supabase/supabase-js'"

```bash
npm install @supabase/supabase-js --legacy-peer-deps
```

### Authentication not working

1. Check Supabase credentials in `.env`
2. Verify RLS policies in Supabase dashboard
3. Check browser console for errors
4. Ensure user exists in Auth dashboard

### Database operations failing

1. Check Supabase connection
2. Verify table permissions (RLS policies)
3. Check network tab for API errors
4. Review backend/database.js error logs

### Redirect loops

1. Clear browser storage
2. Check ProtectedRoute logic
3. Verify session persistence
4. Check redirect URLs

## Support

For issues or questions:

1. Check backend/README.md for setup details
2. Review Supabase dashboard for auth/database errors
3. Check browser console for client-side errors
4. Review network tab for API failures

## License

Same as parent project (see LICENSE)
