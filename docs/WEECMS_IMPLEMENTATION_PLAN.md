# weeCMS - Custom Content Management System Implementation Plan

## Executive Summary

This document outlines the complete implementation plan for transforming BS WeeStaater into a fully content-manageable site via a custom CMS system called **weeCMS**. The goal is to eliminate hard-coded content and make all site elements editable through the admin interface.

---

## Current State Analysis

### ✅ Already Database-Driven (GOOD)

These sections are already fully or partially managed via Supabase:

1. **Books Section**
   - ✅ Table: `books`
   - ✅ Admin interface: `/admin/books`
   - ✅ Full CRUD operations
   - ✅ Draft/publish workflow

2. **Articles Section**
   - ✅ Table: `articles`
   - ✅ Admin interface: `/admin/articles`
   - ✅ Categories: React, Agile, A11y, Landie
   - ✅ Rich HTML content support
   - ✅ Scheduled publishing
   - ✅ Featured articles
   - ✅ Tags and categorization
   - ✅ Image upload support

3. **Football Section**
   - ✅ Tables: `football_seasons`, `football_matches`, `football_match_goals`, `football_match_cards`, `football_season_stats`
   - ✅ Admin interface: `/admin/football`
   - ✅ Complete match tracking system
   - ✅ Player statistics
   - ✅ Season management

4. **Slimming World Section**
   - ✅ Tables: `slimming_world_profiles`, `slimming_world_entries`, `slimming_world_target_weights`
   - ✅ Admin interface: `/admin/slimming-world`
   - ✅ Weight tracking
   - ✅ Target history

5. **Garmin/Fitness Data**
   - ✅ Table: `garmin_activities`
   - ⚠️ No admin interface (managed via imports)
   - ✅ Daily steps tracking

6. **Strava Integration**
   - ✅ Tables: `strava_connections`, `strava_activities`
   - ✅ Sync functionality
   - ⚠️ No admin management

### ❌ Still Hard-Coded (NEEDS MIGRATION)

These elements are currently hard-coded in TSX files:

#### 1. **Home Page Content** (`src/content/home/`)

- ❌ `DynamicCard.tsx` - Introduction card
- ❌ `EthosCard.tsx` - Site philosophy
- ❌ `TrialnErrorCard.tsx` - Learning approach
- ❌ `SlimLineVersion.tsx` - Site description

**Current:** 4 hard-coded React components
**Target:** Database-driven content blocks

#### 2. **About Page Content** (`src/content/about/`)

- ❌ `WhoIsWeestoater.tsx` - Personal bio
- ❌ `WhatIsWeestoater.tsx` - Site explanation
- ❌ `SadMessage.tsx` - Motherwell FC commentary
- ❌ `DoingWhatWeCan.tsx` - Activism message
- ❌ `ShapesDemo.tsx` - CSS shapes demo

**Current:** 5 hard-coded React components
**Target:** Database-driven content blocks

#### 3. **Navigation Structure** (`src/patterns/appheader.tsx`)

- ❌ Hard-coded nav items array
- ❌ Hard-coded routes in `App.tsx`
- ❌ No ability to reorder, hide, or customize navigation

**Current:** Array of strings in code
**Target:** Database-driven navigation with ordering, visibility, and permissions

#### 4. **Site Configuration**

- ❌ Site title in multiple places
- ❌ Social media links (none currently, but future)
- ❌ Contact information
- ❌ Footer content
- ❌ Theme options

**Current:** Scattered across components
**Target:** Centralized site_config table

#### 5. **SEO Content** (`public/`)

- ❌ `sitemap.xml` - Static XML file
- ❌ `robots.txt` - Static text file
- ❌ Meta tags hard-coded in components

**Current:** Static files
**Target:** Dynamic generation from database

#### 6. **CV/Resume Data** (`src/data/burtware-cv.json`)

- ⚠️ Static JSON file
- ❌ No admin interface
- ❌ No versioning

**Current:** Static JSON
**Target:** Database-driven with version history

#### 7. **Static Assets**

- ⚠️ Images in `src/assets/img/`
- ⚠️ No media library management
- ⚠️ No CDN optimization

**Current:** File system storage
**Target:** Supabase Storage with admin interface

---

## weeCMS Architecture

### Database Schema Design

#### New Tables Required

##### 1. `content_blocks`

Dynamic, reusable content blocks for pages.

```sql
CREATE TABLE IF NOT EXISTS content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identification
  slug TEXT UNIQUE NOT NULL,           -- e.g., 'home-dynamic-card'
  title TEXT NOT NULL,

  -- Content
  content TEXT NOT NULL,               -- HTML content
  excerpt TEXT,
  icon TEXT,                           -- Bootstrap icon class

  -- Categorization
  page TEXT NOT NULL,                  -- 'home', 'about', 'custom'
  section TEXT,                        -- Optional section grouping
  content_type TEXT DEFAULT 'card',    -- 'card', 'hero', 'text', 'embed'

  -- Display
  order_index INTEGER DEFAULT 0,
  grid_size TEXT DEFAULT 'col-xxl-3 col-xl-4 col-lg-4 col-md-6',

  -- Publishing
  published BOOLEAN DEFAULT TRUE,
  publish_at TIMESTAMPTZ,
  unpublish_at TIMESTAMPTZ,

  -- Metadata
  metadata JSONB,                      -- Flexible data (tags, author, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_content_blocks_page ON content_blocks(page, order_index);
CREATE INDEX idx_content_blocks_published ON content_blocks(published);
CREATE INDEX idx_content_blocks_slug ON content_blocks(slug);
```

##### 2. `navigation_items`

Dynamic navigation structure.

```sql
CREATE TABLE IF NOT EXISTS navigation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Structure
  label TEXT NOT NULL,
  path TEXT NOT NULL,                  -- '/about', '/football', etc.
  parent_id UUID REFERENCES navigation_items(id) ON DELETE CASCADE,

  -- Display
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE,

  -- Access Control
  require_auth BOOLEAN DEFAULT FALSE,
  allowed_roles TEXT[],                -- ['admin', 'editor']

  -- Behavior
  external BOOLEAN DEFAULT FALSE,
  new_window BOOLEAN DEFAULT FALSE,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_navigation_items_parent ON navigation_items(parent_id);
CREATE INDEX idx_navigation_items_order ON navigation_items(order_index);
CREATE INDEX idx_navigation_items_visible ON navigation_items(visible);
```

##### 3. `site_config`

Global site configuration (singleton table).

```sql
CREATE TABLE IF NOT EXISTS site_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic Info
  site_name TEXT NOT NULL DEFAULT 'weestoater',
  site_tagline TEXT,
  site_description TEXT,

  -- Branding
  logo_url TEXT,
  favicon_url TEXT,

  -- Contact & Social
  email TEXT,
  social_links JSONB,                  -- {twitter, github, linkedin, etc.}

  -- SEO
  default_og_image TEXT,
  google_analytics_id TEXT,
  google_site_verification TEXT,

  -- Features
  enable_search BOOLEAN DEFAULT FALSE,
  enable_comments BOOLEAN DEFAULT FALSE,
  maintenance_mode BOOLEAN DEFAULT FALSE,
  maintenance_message TEXT,

  -- Theme
  default_theme TEXT DEFAULT 'light',
  allowed_themes TEXT[] DEFAULT ARRAY['light', 'dark', 'high-contrast', 'gov-uk'],

  -- Footer
  footer_text TEXT,
  footer_links JSONB,

  -- Metadata
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT
);

-- Insert default configuration
INSERT INTO site_config (site_name, site_tagline, site_description)
VALUES (
  'weestoater',
  'Front-end Development & Accessibility',
  'Portfolio of Ian Burrett - Web Developer specializing in React, TypeScript, and accessible web design'
)
ON CONFLICT DO NOTHING;
```

##### 4. `pages`

Dynamic page management (for future custom pages).

```sql
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identification
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,

  -- Content
  content TEXT,                        -- HTML content
  layout TEXT DEFAULT 'default',       -- 'default', 'full-width', 'sidebar'

  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],

  -- Publishing
  published BOOLEAN DEFAULT FALSE,
  publish_at TIMESTAMPTZ,

  -- Metadata
  author TEXT DEFAULT 'Ian Burrett',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_published ON pages(published);
```

##### 5. `media_library`

Centralized media management.

```sql
CREATE TABLE IF NOT EXISTS media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- File Info
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_type TEXT NOT NULL,             -- 'image', 'video', 'document', 'other'
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,          -- bytes

  -- Storage
  storage_path TEXT NOT NULL,          -- Supabase Storage path
  storage_bucket TEXT DEFAULT 'public',
  public_url TEXT NOT NULL,

  -- Image-specific
  width INTEGER,
  height INTEGER,
  alt_text TEXT,

  -- Organization
  folder TEXT,
  tags TEXT[],

  -- Usage Tracking
  used_in_tables TEXT[],               -- ['articles', 'content_blocks']
  usage_count INTEGER DEFAULT 0,

  -- Metadata
  uploaded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_media_library_file_type ON media_library(file_type);
CREATE INDEX idx_media_library_folder ON media_library(folder);
CREATE INDEX idx_media_library_tags ON media_library USING GIN(tags);
```

##### 6. `cv_entries`

Structured CV/resume data.

```sql
CREATE TABLE IF NOT EXISTS cv_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Entry Type
  entry_type TEXT NOT NULL,            -- 'experience', 'education', 'skill', 'certification'

  -- Basic Info
  title TEXT NOT NULL,
  organization TEXT,
  location TEXT,

  -- Dates
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,

  -- Content
  description TEXT,
  highlights TEXT[],
  skills_used TEXT[],

  -- Display
  order_index INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cv_entries_type ON cv_entries(entry_type, order_index);
CREATE INDEX idx_cv_entries_visible ON cv_entries(visible);
```

##### 7. `activity_log`

Audit trail for content changes.

```sql
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Action
  action TEXT NOT NULL,                -- 'create', 'update', 'delete', 'publish', 'unpublish'
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,

  -- User
  user_id UUID,
  user_email TEXT,

  -- Changes
  old_data JSONB,
  new_data JSONB,

  -- Context
  ip_address TEXT,
  user_agent TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_log_table ON activity_log(table_name, record_id);
CREATE INDEX idx_activity_log_user ON activity_log(user_id);
CREATE INDEX idx_activity_log_created ON activity_log(created_at DESC);
```

---

## Implementation Roadmap

### Phase 1: Core Infrastructure (Week 1)

**Goal:** Set up the foundation for weeCMS

#### Tasks:

1. **Create Database Schema**
   - [ ] Run new schema SQL in Supabase
   - [ ] Set up Row Level Security policies
   - [ ] Create database indexes
   - [ ] Test with sample data

2. **Create Base Services**
   - [ ] `backend/supabase/contentService.js` - Content blocks CRUD
   - [ ] `backend/supabase/navigationService.js` - Navigation CRUD
   - [ ] `backend/supabase/configService.js` - Site config management
   - [ ] `backend/supabase/mediaService.js` - Media library operations
   - [ ] Update `backend/index.js` to export new services

3. **Set Up Storage Buckets**
   - [ ] Create `public` bucket in Supabase Storage
   - [ ] Set up image optimization policies
   - [ ] Configure CORS for uploads

#### Deliverables:

- ✅ All tables created
- ✅ Service layer implemented
- ✅ Storage configured
- ✅ Documentation updated

---

### Phase 2: Content Blocks System (Week 2)

**Goal:** Migrate Home and About page content to database

#### Tasks:

1. **Build Admin Interface - Content Blocks**
   - [ ] Create `/admin/content-blocks` manager
   - [ ] Create `/admin/content-blocks/new` editor
   - [ ] Create `/admin/content-blocks/edit/:id` editor
   - [ ] Add WYSIWYG editor (TinyMCE or similar)
   - [ ] Add preview functionality

2. **Migrate Existing Content**
   - [ ] Write migration script for Home page cards
   - [ ] Write migration script for About page cards
   - [ ] Run migrations
   - [ ] Verify data integrity

3. **Update Frontend Components**
   - [ ] Create `ContentBlock.tsx` generic renderer
   - [ ] Update `HomePage.tsx` to fetch from database
   - [ ] Update `AboutPage.tsx` to fetch from database
   - [ ] Add loading states
   - [ ] Add error handling

4. **Archive Old Components**
   - [ ] Move hard-coded components to `/archive/`
   - [ ] Update imports
   - [ ] Remove unused dependencies

#### Files to Create:

```
src/pages/admin/
  ├── ContentBlocksManager.tsx
  ├── ContentBlockEditor.tsx

src/components/content/
  ├── ContentBlock.tsx
  ├── ContentBlockGrid.tsx

backend/supabase/
  ├── migrate-content-blocks.js
```

#### Deliverables:

- ✅ Content blocks fully manageable
- ✅ Home & About pages database-driven
- ✅ Old components archived
- ✅ Admin interface working

---

### Phase 3: Navigation System (Week 3)

**Goal:** Make navigation dynamic and manageable

#### Tasks:

1. **Build Admin Interface - Navigation**
   - [ ] Create `/admin/navigation` manager
   - [ ] Add drag-and-drop reordering
   - [ ] Add nested navigation support
   - [ ] Add visibility toggles
   - [ ] Add permission settings

2. **Migrate Current Navigation**
   - [ ] Write migration script for nav items
   - [ ] Populate database with existing routes
   - [ ] Test navigation data

3. **Update Navigation Components**
   - [ ] Update `Header.tsx` to fetch from database
   - [ ] Add recursive menu rendering for sub-items
   - [ ] Update `App.tsx` route generation (or keep static)
   - [ ] Add active state logic
   - [ ] Add permission checks

4. **Dynamic Routing (Optional)**
   - [ ] Consider if routes should be database-driven
   - [ ] Implement dynamic route generation if desired
   - [ ] Update route guards

#### Deliverables:

- ✅ Navigation fully manageable
- ✅ Reordering works
- ✅ Visibility controls work
- ✅ Admin interface intuitive

---

### Phase 4: Site Configuration (Week 3-4) ✅ COMPLETE

**Goal:** Centralize all site settings

**Status**: Backend, admin interface, and hooks complete. Component integration planned for Phase 4.5 (after Phase 5).

#### Tasks:

1. **Build Admin Interface - Settings**
   - [x] Create `/admin/settings` page with tabs:
     - [x] General (name, tagline, description)
     - [x] Branding (logo, favicon)
     - [x] SEO (meta tags, analytics)
     - [x] Social Media (links)
     - [x] Features (enable/disable functionality)
     - [x] Theme (default theme, options)
     - [x] Footer (text, links)
     - [x] Maintenance (mode, message)

2. **Populate Site Config**
   - [x] Add current site information
   - [x] Configure default theme
   - [ ] Add logo and favicon (Phase 5 - Media Library)

3. **Update Components to Use Config** → **Phase 4.5** (After Phase 5)
   - [ ] Update `Header.tsx` for site name/logo
   - [ ] Create `Footer.tsx` component using config
   - [ ] Update `index.html` for dynamic title
   - [ ] Add maintenance mode check
   - [ ] Add analytics scripts

4. **Add Configuration Hook**
   - [x] Create `useSiteConfig()` hook
   - [x] Implement caching strategy
   - [x] Add config refresh logic

#### Deliverables:

- ✅ All site settings manageable
- ✅ Settings page complete with 6 tabs
- ✅ Backend service implemented
- ✅ Migration script created
- ✅ useSiteConfig() hook with caching
- ⏳ Component integration pending (Phase 4.5)

---

### Phase 4.5: Settings Integration (After Phase 5)

**Goal:** Integrate site configuration into existing components

**Note:** Deferred until after Phase 5 (Media Library) so logo/favicon can be uploaded and used.

#### Tasks:

1. **Update Header Component**
   - [ ] Use `config.site_name` from useSiteConfig()
   - [ ] Use `config.logo_url` when available
   - [ ] Fallback to current hard-coded values

2. **Create Footer Component**
   - [ ] New `src/patterns/Footer.tsx`
   - [ ] Use `config.footer_text`
   - [ ] Render `config.footer_links`
   - [ ] Add to App.tsx layout

3. **Dynamic Page Titles**
   - [ ] Update `useSEO` hook to use config.site_name
   - [ ] Format: `{pageTitle} | {config.site_name}`

4. **Maintenance Mode Gate**
   - [ ] Create MaintenanceModePage component
   - [ ] Check config.maintenance_mode in App.tsx
   - [ ] Show maintenance message to non-admin users
   - [ ] Allow admins to bypass

5. **Analytics Integration**
   - [ ] Create analytics utility
   - [ ] Load Google Analytics if config.google_analytics_id set
   - [ ] Initialize on app mount

#### Deliverables:

- ⏳ All components use database configuration
- ⏳ No hard-coded site info
- ⏳ Maintenance mode functional
- ⏳ Analytics integrated

---

### Phase 5: Media Library (Week 4)

**Goal:** Professional media management system

#### Tasks:

1. **Build Admin Interface - Media Library**
   - [ ] Create `/admin/media` library browser
   - [ ] Add upload functionality (drag-and-drop)
   - [ ] Add image preview/lightbox
   - [ ] Add bulk upload support

### Phase 5: Media Library (Week 4) ✅ COMPLETE

**Goal:** Professional media management system

**Status**: Core media library complete. TinyMCE integration and migration planned for Phase 5.5.

#### Tasks:

1. **Build Admin Interface - Media Library**
   - [x] Create `/admin/media` library browser
   - [x] Add upload functionality (drag-and-drop)
   - [x] Add image preview/lightbox
   - [x] Add bulk upload support
   - [x] Add folder organization
   - [x] Add search and filtering
   - [x] Add usage tracking (backend ready)
   - [x] Add delete with warnings

2. **Image Processing** → **Phase 5.5** (Advanced features)
   - [ ] Set up Supabase Storage transformations
   - [ ] Add automatic WebP conversion
   - [ ] Add thumbnail generation
   - [ ] Add image optimization

3. **Integrate with Editors** → **Phase 5.5**
   - [ ] Add media picker to article editor
   - [ ] Add media picker to content block editor
   - [ ] Add inline image insertion
   - [ ] Update URL references

4. **Migrate Existing Media** → **Phase 5.5**
   - [ ] Upload current images to Supabase Storage
   - [ ] Update database references
   - [ ] Update all content using old paths
   - [ ] Archive local images

#### Deliverables:

- ✅ Media library fully functional
- ✅ Upload/organize works smoothly
- ✅ Drag-and-drop upload
- ✅ File type filtering and search
- ✅ Image preview modal
- ✅ Delete with warnings
- ✅ Stats dashboard
- ✅ Storage check script
- ⏳ Editor integration pending (Phase 5.5)
- ⏳ Media migration pending (Phase 5.5)

---

### Phase 5.5: Media Integration (Partially Complete)

**Goal:** Integrate media library with content editors and migrate existing media

**Status:** TinyMCE integration ✅ complete. Media migration pending.

#### Tasks:

1. **TinyMCE Media Picker** ✅ COMPLETE
   - [x] Add "Insert Media" button to TinyMCE toolbar
   - [x] Create media picker modal component
   - [x] Show filterable media grid in modal
   - [x] Insert selected image at cursor position
   - [x] Update article editor to use media picker
   - [x] Update content block editor to use media picker
   - [x] Support for images, videos, audio, and documents

2. **Media Migration** ⏳
   - [ ] Create migration script for `src/assets/img/`
   - [ ] Upload all images to Supabase Storage
   - [ ] Update database references to new URLs
   - [ ] Fix broken image paths in components:
     - [ ] `WhoIsWeestoater.tsx`
     - [ ] `WhatIsWeestoater.tsx`
     - [ ] `ShapesDemo.tsx`
   - [ ] Archive local images (move to archive/)

3. **Advanced Features** (Optional)
   - [ ] Bulk operations (select multiple files)
   - [ ] Image editing (crop, resize)
   - [ ] Alt text editor modal
   - [ ] Tag management UI
   - [ ] Usage tracking display
   - [ ] Folder tree view
   - [ ] File rename/move

#### Deliverables:

- ✅ Media picker integrated with editors
- ⏳ All existing media migrated to Supabase
- ⏳ No local images in src/assets/img/
- ⏳ All content uses new Supabase URLs

---

### Phase 6: Enhanced Features (Week 5)

**Goal:** Add power features to weeCMS

#### Tasks:

1. **Custom Pages System**
   - [ ] Build `/admin/pages` manager
   - [ ] Build `/admin/pages/new` editor
   - [ ] Build `/admin/pages/edit/:id` editor
   - [ ] Add dynamic route handler
   - [ ] Add template selection

2. **CV/Resume Management**
   - [ ] Build `/admin/cv` manager
   - [ ] Add entry editor
   - [ ] Migrate existing CV data
   - [ ] Create `/cv` public page
   - [ ] Add PDF export functionality

3. **Activity Log / Audit Trail**
   - [ ] Implement activity logging service
   - [ ] Add to all CRUD operations
   - [ ] Build `/admin/activity` viewer
   - [ ] Add filtering and search
   - [ ] Add export functionality

4. **Search Functionality**
   - [ ] Implement full-text search
   - [ ] Create search API endpoint
   - [ ] Build search UI component
   - [ ] Add search to navigation
   - [ ] Index all content types

#### Deliverables:

- ✅ Custom pages working
- ✅ CV management complete
- ✅ Activity logging operational
- ✅ Search functional

---

### Phase 7: Polish & Optimization (Week 6)

**Goal:** Production-ready weeCMS

#### Tasks:

1. **Performance Optimization**
   - [ ] Implement query caching
   - [ ] Add pagination to all lists
   - [ ] Optimize image loading
   - [ ] Add lazy loading
   - [ ] Minimize database queries

2. **SEO Automation**
   - [ ] Auto-generate `sitemap.xml` from database
   - [ ] Dynamic `robots.txt` generation
   - [ ] Add structured data (Schema.org)
   - [ ] Implement Open Graph tags
   - [ ] Add Twitter Card support

3. **User Experience Improvements**
   - [ ] Add keyboard shortcuts to editors
   - [ ] Add autosave functionality
   - [ ] Add version history
   - [ ] Add undo/redo
   - [ ] Add rich previews

4. **Documentation**
   - [ ] Write user guide for weeCMS
   - [ ] Create video tutorials
   - [ ] Document all admin features
   - [ ] Create developer documentation
   - [ ] Add inline help/tooltips

5. **Testing**
   - [ ] Write unit tests for services
   - [ ] Write integration tests
   - [ ] Write E2E tests for admin
   - [ ] Perform security audit
   - [ ] Load testing

#### Deliverables:

- ✅ Site performs excellently
- ✅ SEO fully automated
- ✅ UX polished and intuitive
- ✅ Comprehensive documentation
- ✅ Test coverage >80%

---

## Technical Considerations

### Security

1. **Row Level Security (RLS)**
   - All tables must have proper RLS policies
   - Public read, authenticated write (admin only)
   - Consider role-based access control (RBAC)

2. **Authentication**
   - Current system uses Supabase Auth
   - All admin routes protected by `ProtectedRoute`
   - Consider adding role management

3. **Input Validation**
   - Sanitize HTML content (XSS prevention)
   - Validate all inputs server-side
   - Implement rate limiting

### Performance

1. **Caching Strategy**
   - Cache site config in React Context
   - Cache navigation in localStorage
   - Implement SWR or React Query for data fetching

2. **Database Optimization**
   - Proper indexes on all searchable fields
   - Use database views for complex queries
   - Implement pagination for all lists

3. **Image Optimization**
   - Use WebP format with fallbacks
   - Implement responsive images
   - Lazy load below-the-fold images
   - Use Supabase Storage transformations

### Data Migration

1. **Migration Scripts**
   - Write idempotent migrations (can run multiple times)
   - Implement rollback capability
   - Log all migrations
   - Test thoroughly before production

2. **Backup Strategy**
   - Backup before each major migration
   - Use Supabase backup features
   - Document restoration process

---

## Success Metrics

### Week 2

- [ ] All content blocks in database
- [ ] Home & About pages dynamic

### Week 4

- [ ] Navigation dynamic
- [ ] Site config centralized
- [ ] Media library operational

### Week 6

- [ ] Zero hard-coded content
- [ ] All admin interfaces complete
- [ ] Documentation finished
- [ ] Tests passing

---

## File Structure (New)

```
backend/supabase/
├── content-blocks-schema.sql        # New schema
├── navigation-schema.sql            # New schema
├── site-config-schema.sql           # New schema
├── media-library-schema.sql         # New schema
├── pages-schema.sql                 # New schema
├── cv-schema.sql                    # New schema
├── activity-log-schema.sql          # New schema
├── contentService.js                # New service
├── navigationService.js             # New service
├── configService.js                 # New service
├── mediaService.js                  # New service
├── migrate-content-blocks.js        # Migration
└── migrate-navigation.js            # Migration

src/pages/admin/
├── ContentBlocksManager.tsx         # New
├── ContentBlockEditor.tsx           # New
├── NavigationManager.tsx            # New
├── SiteSettings.tsx                 # New
├── MediaLibrary.tsx                 # New
├── PagesManager.tsx                 # New
├── PageEditor.tsx                   # New
└── CVManager.tsx                    # New

src/components/content/
├── ContentBlock.tsx                 # New - Generic content renderer
├── ContentBlockGrid.tsx             # New - Grid layout
├── DynamicPage.tsx                  # New - Dynamic page renderer
└── MediaPicker.tsx                  # New - Media selection component

src/hooks/
├── useContentBlocks.ts              # New
├── useNavigation.ts                 # New
├── useSiteConfig.ts                 # New
└── useMediaLibrary.ts               # New
```

---

## Next Steps

1. **Review this plan** - Ensure it aligns with your vision
2. **Prioritize phases** - Which features are most important?
3. **Set timeline** - Realistic dates for each phase
4. **Start Phase 1** - Begin with database schema creation

Would you like me to start implementing any specific phase?
