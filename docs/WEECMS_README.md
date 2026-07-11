# weeCMS - Your Custom Content Management System

Welcome to **weeCMS** - a bespoke, lightweight content management system built specifically for BS WeeStaater using Supabase and React.

## 📚 Documentation

- **[Implementation Plan](./WEECMS_IMPLEMENTATION_PLAN.md)** - Complete roadmap with 7 phases
- **[Status Summary](./WEECMS_STATUS_SUMMARY.md)** - Quick reference: what's done vs. what needs doing
- **[Schema Documentation](#)** - Database schema reference (see `backend/supabase/weecms-schema.sql`)

## 🎯 Quick Start

### 1. Install the Database Schema

Open your Supabase SQL Editor and run:

```bash
backend/supabase/weecms-schema.sql
```

This creates:

- ✅ 7 new tables (content_blocks, navigation_items, site_config, pages, media_library, cv_entries, activity_log)
- ✅ All necessary indexes
- ✅ Row Level Security policies
- ✅ Helper views and functions
- ✅ Sample navigation data

### 2. Migrate Existing Content

Run the content blocks migration:

```bash
cd backend
node supabase/migrate-content-blocks.js
```

This migrates:

- ✅ 4 Home page cards → database
- ✅ 4 About page cards → database

### 3. Build the Service Layer

Create these files in `backend/supabase/`:

- `contentService.js` - Content blocks CRUD
- `navigationService.js` - Navigation management
- `configService.js` - Site configuration
- `mediaService.js` - Media library operations

See the Implementation Plan for detailed code examples.

### 4. Create Admin Interfaces

Build these pages in `src/pages/admin/`:

- `ContentBlocksManager.tsx`
- `ContentBlockEditor.tsx`
- `NavigationManager.tsx`
- `SiteSettings.tsx`
- `MediaLibrary.tsx`

Follow the existing patterns from:

- `ArticlesManager.tsx` - List view example
- `ArticleEditor.tsx` - Edit form example

### 5. Update Frontend Pages

Modify these files to fetch from database:

- `src/pages/Home.tsx` - Fetch content_blocks for 'home'
- `src/pages/About.tsx` - Fetch content_blocks for 'about'
- `src/patterns/appheader.tsx` - Fetch navigation_items

Create:

- `src/components/content/ContentBlock.tsx` - Generic renderer
- `src/hooks/useContentBlocks.ts` - Data fetching hook
- `src/hooks/useSiteConfig.ts` - Config hook

---

## 📊 Current Status

### ✅ Already Database-Driven (60%)

| Section        | Status      |
| -------------- | ----------- |
| Books          | ✅ Complete |
| Articles       | ✅ Complete |
| Football       | ✅ Complete |
| Slimming World | ✅ Complete |

### 🔨 In Progress (weeCMS - 40%)

| Component      | Status                           |
| -------------- | -------------------------------- |
| Content Blocks | ⏳ Schema ready, needs migration |
| Navigation     | ⏳ Schema ready, needs admin UI  |
| Site Config    | ⏳ Schema ready, needs admin UI  |
| Media Library  | ⏳ Schema ready, needs admin UI  |
| Custom Pages   | ⏳ Schema ready, needs admin UI  |
| CV Management  | ⏳ Schema ready, needs admin UI  |

---

## 🗂️ Database Tables

### Core CMS Tables

#### `content_blocks`

Dynamic content blocks for all pages. Replaces hard-coded TSX components.

**Key Fields:**

- `slug` - Unique identifier (e.g., 'home-dynamic-card')
- `page` - Page grouping ('home', 'about', etc.)
- `content` - HTML content
- `published` - Publication status
- `order_index` - Display order

**Use Cases:**

- Home page cards
- About page cards
- Hero sections
- Custom page sections

#### `navigation_items`

Dynamic navigation structure with nested menu support.

**Key Fields:**

- `label` - Menu text
- `path` - Route path
- `parent_id` - For nested menus
- `order_index` - Display order
- `visible` - Show/hide toggle

**Use Cases:**

- Main navigation
- Footer links
- Breadcrumbs
- Sitemap

#### `site_config`

Global site settings (singleton table).

**Key Fields:**

- `site_name` - Site title
- `logo_url` - Logo image
- `social_links` - JSON of social media
- `default_theme` - Theme preference
- `maintenance_mode` - Site maintenance toggle

**Use Cases:**

- Site branding
- SEO settings
- Feature toggles
- Footer content

#### `pages`

Custom page management.

**Key Fields:**

- `slug` - URL slug
- `title` - Page title
- `content` - HTML content
- `layout` - Template choice
- `published` - Publication status

**Use Cases:**

- Privacy policy
- Terms of service
- Custom landing pages
- Static content pages

#### `media_library`

Centralized media asset management.

**Key Fields:**

- `filename` - File name
- `public_url` - Supabase Storage URL
- `file_type` - image/video/document/etc.
- `alt_text` - Accessibility text
- `tags` - Organization tags

**Use Cases:**

- Image uploads
- Document library
- Asset organization
- Usage tracking

#### `cv_entries`

Structured resume/CV data.

**Key Fields:**

- `entry_type` - experience/education/skill/etc.
- `title` - Position or qualification
- `organization` - Company or institution
- `description` - Details
- `skills_used` - Array of skills

**Use Cases:**

- Professional experience
- Education history
- Skills showcase
- Certifications

#### `activity_log`

Audit trail for content changes.

**Key Fields:**

- `action` - create/update/delete/etc.
- `table_name` - Which table was affected
- `record_id` - Which record
- `old_data` / `new_data` - Change tracking
- `user_email` - Who made the change

**Use Cases:**

- Change tracking
- Audit compliance
- Debugging
- Version history

---

## 🔒 Security

### Row Level Security (RLS)

All tables use RLS policies:

- **Public Read:** Published content visible to everyone
- **Authenticated Write:** Only authenticated users (admins) can modify
- **Service Role:** Migration scripts bypass RLS with service role key

### Authentication

- Uses Supabase Auth
- Admin routes protected by `ProtectedRoute` component
- Role-based access planned for future

---

## 🚀 Development Workflow

### Adding New Content Types

1. **Define Schema** - Add table in `weecms-schema.sql`
2. **Create Service** - Add CRUD in `backend/supabase/`
3. **Build Admin UI** - Create manager + editor pages
4. **Create Frontend Component** - Build display component
5. **Add Navigation Link** - Update admin dashboard
6. **Test** - Write tests for new functionality
7. **Document** - Update this README

### Content Management Workflow

1. **Login** - Navigate to `/admin/login`
2. **Select Section** - Choose from dashboard
3. **Create/Edit** - Use admin interfaces
4. **Preview** - Check before publishing
5. **Publish** - Make live immediately or schedule
6. **View** - Check frontend

---

## 📈 Performance Optimization

### Caching Strategy

1. **Site Config** - Cache in React Context (rarely changes)
2. **Navigation** - Cache in localStorage (changes infrequently)
3. **Content Blocks** - SWR with 5-minute cache
4. **Media** - CDN via Supabase Storage

### Database Optimization

- ✅ Indexes on all searchable fields
- ✅ Views for common queries
- ✅ Pagination for all lists
- ✅ Select only needed fields

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Create content block
- [ ] Edit content block
- [ ] Publish/unpublish content
- [ ] Schedule publishing
- [ ] Upload media
- [ ] Organize media in folders
- [ ] Update navigation
- [ ] Change site settings
- [ ] View activity log
- [ ] Test RLS policies (logout and verify public access)

### Automated Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

---

## 📖 Code Examples

### Fetching Content Blocks

```typescript
// src/hooks/useContentBlocks.ts
import { useState, useEffect } from "react";
import { getSupabaseClient } from "../../../backend/index.js";

export const useContentBlocks = (page: string) => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlocks = async () => {
      const supabase = getSupabaseClient();
      const { data } = await supabase.rpc("get_content_blocks_for_page", {
        page_slug: page,
      });
      setBlocks(data || []);
      setLoading(false);
    };
    fetchBlocks();
  }, [page]);

  return { blocks, loading };
};
```

### Rendering Content Blocks

```typescript
// src/components/content/ContentBlock.tsx
import { ArticleMeta } from '../global/ArticleMeta';

export const ContentBlock = ({ block }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h2>
          {block.icon && <i className={`${block.icon} me-2`}></i>}
          {block.title}
        </h2>
      </div>
      <div className="card-body">
        {block.metadata && (
          <ArticleMeta metadata={block.metadata} />
        )}
        <div dangerouslySetInnerHTML={{ __html: block.content }} />
      </div>
    </div>
  );
};
```

### Using in Pages

```typescript
// src/pages/Home.tsx
import { useContentBlocks } from '../hooks/useContentBlocks';
import { ContentBlock } from '../components/content/ContentBlock';

export const HomePage = () => {
  const { blocks, loading } = useContentBlocks('home');

  if (loading) return <SkeletonCard />;

  return (
    <div className="row">
      {blocks.map(block => (
        <div key={block.id} className={`${block.grid_size} mb-4`}>
          <ContentBlock block={block} />
        </div>
      ))}
    </div>
  );
};
```

---

## 🛠️ Troubleshooting

### Migration Errors

**Problem:** Migration script fails with RLS error

**Solution:** Ensure you're using service role key:

```javascript
const supabase = getSupabaseClient(null, true);
```

**Problem:** Content not appearing on frontend

**Solution:** Check:

1. Content is published (`published = TRUE`)
2. `publish_at` date is in the past (or NULL)
3. `unpublish_at` date is in the future (or NULL)

### Admin Interface Issues

**Problem:** Can't edit content

**Solution:** Verify:

1. User is authenticated
2. RLS policies are correct
3. Using authenticated Supabase client

---

## 📞 Support & Resources

### Documentation

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

### Internal Docs

- [Football Database Guide](./FOOTBALL_DATABASE_GUIDE.md)
- [Slimming World Guide](./SLIMMING_WORLD_DATABASE_GUIDE.md)
- [Admin Interface Guide](./ADMIN_INTERFACE_GUIDE.md)

---

## 🎉 Success Criteria

### Phase 1 Complete ✅

- [ ] Schema installed in Supabase
- [ ] All tables created
- [ ] RLS policies working
- [ ] Sample data populated

### Phase 2 Complete ✅

- [ ] Content blocks migrated
- [ ] Admin interfaces built
- [ ] Home & About pages dynamic
- [ ] Old components archived

### Full weeCMS Complete ✅

- [ ] All content database-driven
- [ ] Zero hard-coded content
- [ ] All admin UIs functional
- [ ] Documentation complete
- [ ] Tests passing
- [ ] Performance optimized

---

## 📝 Change Log

### 2026-07-07 - Initial weeCMS Implementation

- Created schema for 7 new tables
- Wrote migration script for content blocks
- Documented implementation plan
- Defined 7-phase roadmap

---

Built with ❤️ by Ian Burrett using React, TypeScript, Supabase, and too much coffee.
