-- ============================================================================
-- WEECMS DATABASE SCHEMA
-- ============================================================================
-- Custom Content Management System for BS WeeStaater
-- This schema extends the existing database with CMS capabilities
--
-- Run this in your Supabase SQL Editor after the main schema.sql
--
-- New Tables:
--   1. content_blocks - Dynamic content blocks for pages
--   2. navigation_items - Dynamic navigation structure
--   3. site_config - Global site configuration
--   4. pages - Custom page management
--   5. media_library - Centralized media management
--   6. cv_entries - Structured CV/resume data
--   7. activity_log - Audit trail for content changes
-- ============================================================================

-- ============================================================================
-- 1. CONTENT BLOCKS
-- ============================================================================
-- Dynamic, reusable content blocks for pages (Home, About, etc.)

CREATE TABLE IF NOT EXISTS content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identification
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  
  -- Content
  content TEXT NOT NULL,
  excerpt TEXT,
  icon TEXT,
  
  -- Categorization
  page TEXT NOT NULL,
  section TEXT,
  content_type TEXT DEFAULT 'card' CHECK (content_type IN ('card', 'hero', 'text', 'embed', 'custom')),
  
  -- Display
  order_index INTEGER DEFAULT 0,
  grid_size TEXT DEFAULT 'col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-12',
  
  -- Publishing
  published BOOLEAN DEFAULT TRUE,
  publish_at TIMESTAMPTZ,
  unpublish_at TIMESTAMPTZ,
  
  -- Metadata (flexible JSON for tags, author, reading time, etc.)
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_blocks_page ON content_blocks(page, order_index);
CREATE INDEX IF NOT EXISTS idx_content_blocks_published ON content_blocks(published);
CREATE INDEX IF NOT EXISTS idx_content_blocks_slug ON content_blocks(slug);
CREATE INDEX IF NOT EXISTS idx_content_blocks_publish_dates ON content_blocks(publish_at, unpublish_at);

-- Enable RLS
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Content blocks are publicly readable" ON content_blocks;
DROP POLICY IF EXISTS "Only admins can manage content blocks" ON content_blocks;

CREATE POLICY "Content blocks are publicly readable"
  ON content_blocks FOR SELECT
  USING (
    published = TRUE 
    AND (publish_at IS NULL OR publish_at <= NOW())
    AND (unpublish_at IS NULL OR unpublish_at > NOW())
  );

CREATE POLICY "Only admins can manage content blocks"
  ON content_blocks FOR ALL
  USING (auth.role() = 'authenticated');

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_content_blocks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS content_blocks_updated_at_trigger ON content_blocks;
CREATE TRIGGER content_blocks_updated_at_trigger
  BEFORE UPDATE ON content_blocks
  FOR EACH ROW
  EXECUTE FUNCTION update_content_blocks_updated_at();

-- ============================================================================
-- 2. NAVIGATION ITEMS
-- ============================================================================
-- Dynamic navigation structure with support for nested menus

CREATE TABLE IF NOT EXISTS navigation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Structure
  label TEXT NOT NULL,
  path TEXT NOT NULL,
  parent_id UUID REFERENCES navigation_items(id) ON DELETE CASCADE,
  
  -- Display
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE,
  
  -- Access Control
  require_auth BOOLEAN DEFAULT FALSE,
  allowed_roles TEXT[],
  
  -- Behavior
  external BOOLEAN DEFAULT FALSE,
  new_window BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_navigation_items_parent ON navigation_items(parent_id);
CREATE INDEX IF NOT EXISTS idx_navigation_items_order ON navigation_items(order_index);
CREATE INDEX IF NOT EXISTS idx_navigation_items_visible ON navigation_items(visible);

-- Enable RLS
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Navigation items are publicly readable" ON navigation_items;
DROP POLICY IF EXISTS "Only admins can manage navigation" ON navigation_items;

CREATE POLICY "Navigation items are publicly readable"
  ON navigation_items FOR SELECT
  USING (visible = TRUE);

CREATE POLICY "Only admins can manage navigation"
  ON navigation_items FOR ALL
  USING (auth.role() = 'authenticated');

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_navigation_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS navigation_items_updated_at_trigger ON navigation_items;
CREATE TRIGGER navigation_items_updated_at_trigger
  BEFORE UPDATE ON navigation_items
  FOR EACH ROW
  EXECUTE FUNCTION update_navigation_items_updated_at();

-- ============================================================================
-- 3. SITE CONFIG
-- ============================================================================
-- Global site configuration (singleton table)

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
  social_links JSONB DEFAULT '{}',
  
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
  default_theme TEXT DEFAULT 'light' CHECK (default_theme IN ('light', 'dark', 'high-contrast', 'gov-uk')),
  allowed_themes TEXT[] DEFAULT ARRAY['light', 'dark', 'high-contrast', 'gov-uk'],
  
  -- Footer
  footer_text TEXT,
  footer_links JSONB DEFAULT '[]',
  
  -- Metadata
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT
);

-- Enable RLS
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Site config is publicly readable" ON site_config;
DROP POLICY IF EXISTS "Only admins can update site config" ON site_config;

CREATE POLICY "Site config is publicly readable"
  ON site_config FOR SELECT
  USING (TRUE);

CREATE POLICY "Only admins can update site config"
  ON site_config FOR ALL
  USING (auth.role() = 'authenticated');

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_site_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS site_config_updated_at_trigger ON site_config;
CREATE TRIGGER site_config_updated_at_trigger
  BEFORE UPDATE ON site_config
  FOR EACH ROW
  EXECUTE FUNCTION update_site_config_updated_at();

-- Insert default configuration
INSERT INTO site_config (
  site_name, 
  site_tagline, 
  site_description,
  default_theme,
  footer_text
)
VALUES (
  'weestoater',
  'Front-end Development & Accessibility',
  'Portfolio of Ian Burrett - Web Developer specializing in React, TypeScript, and accessible web design',
  'light',
  '© 2026 Ian Burrett. Built with React, TypeScript, and Supabase.'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 4. PAGES
-- ============================================================================
-- Dynamic custom page management

CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identification
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  
  -- Content
  content TEXT,
  layout TEXT DEFAULT 'default' CHECK (layout IN ('default', 'full-width', 'sidebar', 'blank')),
  
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_published ON pages(published);

-- Enable RLS
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Pages are publicly readable" ON pages;
DROP POLICY IF EXISTS "Only admins can manage pages" ON pages;

CREATE POLICY "Pages are publicly readable"
  ON pages FOR SELECT
  USING (
    published = TRUE 
    AND (publish_at IS NULL OR publish_at <= NOW())
  );

CREATE POLICY "Only admins can manage pages"
  ON pages FOR ALL
  USING (auth.role() = 'authenticated');

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS pages_updated_at_trigger ON pages;
CREATE TRIGGER pages_updated_at_trigger
  BEFORE UPDATE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION update_pages_updated_at();

-- ============================================================================
-- 5. MEDIA LIBRARY
-- ============================================================================
-- Centralized media management for all uploads

CREATE TABLE IF NOT EXISTS media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- File Info
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video', 'document', 'audio', 'other')),
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  
  -- Storage
  storage_path TEXT NOT NULL,
  storage_bucket TEXT DEFAULT 'images',
  public_url TEXT NOT NULL,
  
  -- Image-specific
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  
  -- Organization
  folder TEXT,
  tags TEXT[],
  
  -- Usage Tracking
  used_in_tables TEXT[],
  usage_count INTEGER DEFAULT 0,
  
  -- Metadata
  uploaded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_media_library_file_type ON media_library(file_type);
CREATE INDEX IF NOT EXISTS idx_media_library_folder ON media_library(folder);
CREATE INDEX IF NOT EXISTS idx_media_library_tags ON media_library USING GIN(tags);

-- Enable RLS
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Media library is publicly readable" ON media_library;
DROP POLICY IF EXISTS "Only admins can manage media" ON media_library;

CREATE POLICY "Media library is publicly readable"
  ON media_library FOR SELECT
  USING (TRUE);

CREATE POLICY "Only admins can manage media"
  ON media_library FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- 6. CV ENTRIES
-- ============================================================================
-- Structured CV/resume data

CREATE TABLE IF NOT EXISTS cv_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Entry Type
  entry_type TEXT NOT NULL CHECK (entry_type IN ('experience', 'education', 'skill', 'certification', 'project')),
  
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
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cv_entries_type ON cv_entries(entry_type, order_index);
CREATE INDEX IF NOT EXISTS idx_cv_entries_visible ON cv_entries(visible);

-- Enable RLS
ALTER TABLE cv_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "CV entries are publicly readable" ON cv_entries;
DROP POLICY IF EXISTS "Only admins can manage CV entries" ON cv_entries;

CREATE POLICY "CV entries are publicly readable"
  ON cv_entries FOR SELECT
  USING (visible = TRUE);

CREATE POLICY "Only admins can manage CV entries"
  ON cv_entries FOR ALL
  USING (auth.role() = 'authenticated');

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_cv_entries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS cv_entries_updated_at_trigger ON cv_entries;
CREATE TRIGGER cv_entries_updated_at_trigger
  BEFORE UPDATE ON cv_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_cv_entries_updated_at();

-- ============================================================================
-- 7. ACTIVITY LOG
-- ============================================================================
-- Audit trail for all content changes

CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Action
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'publish', 'unpublish', 'restore')),
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
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_activity_log_table ON activity_log(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON activity_log(created_at DESC);

-- Enable RLS
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Only admins can read activity log" ON activity_log;

CREATE POLICY "Only admins can read activity log"
  ON activity_log FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- HELPER VIEWS
-- ============================================================================

-- View: Active Navigation Items (Top Level)
CREATE OR REPLACE VIEW v_navigation_main AS
SELECT *
FROM navigation_items
WHERE parent_id IS NULL
  AND visible = TRUE
ORDER BY order_index;

-- View: Published Content Blocks by Page
CREATE OR REPLACE VIEW v_content_blocks_published AS
SELECT *
FROM content_blocks
WHERE published = TRUE
  AND (publish_at IS NULL OR publish_at <= NOW())
  AND (unpublish_at IS NULL OR unpublish_at > NOW())
ORDER BY page, order_index;

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function: Get Navigation Tree (recursive)
CREATE OR REPLACE FUNCTION get_navigation_tree()
RETURNS TABLE (
  id UUID,
  label TEXT,
  path TEXT,
  icon TEXT,
  order_index INTEGER,
  parent_id UUID,
  level INTEGER,
  children JSONB
) AS $$
WITH RECURSIVE nav_tree AS (
  -- Base case: top-level items
  SELECT 
    n.id,
    n.label,
    n.path,
    n.icon,
    n.order_index,
    n.parent_id,
    0 AS level,
    '[]'::jsonb AS children
  FROM navigation_items n
  WHERE n.parent_id IS NULL
    AND n.visible = TRUE
  
  UNION ALL
  
  -- Recursive case: child items
  SELECT 
    n.id,
    n.label,
    n.path,
    n.icon,
    n.order_index,
    n.parent_id,
    nt.level + 1,
    '[]'::jsonb
  FROM navigation_items n
  INNER JOIN nav_tree nt ON n.parent_id = nt.id
  WHERE n.visible = TRUE
)
SELECT * FROM nav_tree
ORDER BY level, order_index;
$$ LANGUAGE SQL;

-- Function: Get Content Blocks for Page
CREATE OR REPLACE FUNCTION get_content_blocks_for_page(page_slug TEXT)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  title TEXT,
  content TEXT,
  excerpt TEXT,
  icon TEXT,
  content_type TEXT,
  order_index INTEGER,
  grid_size TEXT,
  metadata JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cb.id,
    cb.slug,
    cb.title,
    cb.content,
    cb.excerpt,
    cb.icon,
    cb.content_type,
    cb.order_index,
    cb.grid_size,
    cb.metadata
  FROM content_blocks cb
  WHERE cb.page = page_slug
    AND cb.published = TRUE
    AND (cb.publish_at IS NULL OR cb.publish_at <= NOW())
    AND (cb.unpublish_at IS NULL OR cb.unpublish_at > NOW())
  ORDER BY cb.order_index;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SAMPLE DATA (for testing)
-- ============================================================================

-- Sample navigation items (current site structure)
INSERT INTO navigation_items (label, path, order_index, visible) VALUES
  ('Home', '/home', 0, TRUE),
  ('About', '/about', 1, TRUE),
  ('A11y', '/a11y', 2, TRUE),
  ('Agile', '/agile', 3, TRUE),
  ('Books', '/books', 4, TRUE),
  ('Football', '/football', 5, TRUE),
  ('Landie', '/landie', 6, TRUE),
  ('React', '/react', 7, TRUE),
  ('SW', '/sw', 8, TRUE)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ weeCMS schema installation complete!';
  RAISE NOTICE '📊 New tables created: 7';
  RAISE NOTICE '🔒 RLS policies configured: All tables';
  RAISE NOTICE '🔍 Views created: 2';
  RAISE NOTICE '⚡ Functions created: 2';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Next steps:';
  RAISE NOTICE '  1. Create service layer in backend/supabase/';
  RAISE NOTICE '  2. Build admin interfaces in src/pages/admin/';
  RAISE NOTICE '  3. Migrate existing content with migration scripts';
  RAISE NOTICE '';
  RAISE NOTICE '📖 See docs/WEECMS_IMPLEMENTATION_PLAN.md for details';
END $$;
