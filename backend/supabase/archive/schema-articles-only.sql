-- ============================================================================
-- ARTICLES TABLE ONLY
-- ============================================================================
-- Run this in your Supabase SQL Editor to add the articles table
-- This assumes the books table already exists
-- ============================================================================

-- Create the articles table
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL, -- 'React', 'Agile', 'Accessibility', 'Landie', etc.
  content TEXT NOT NULL, -- HTML content
  excerpt TEXT,
  icon TEXT, -- Bootstrap icon class (e.g., 'bi-life-preserver')
  published_date DATE NOT NULL,
  updated_date DATE,
  reading_time INTEGER, -- In minutes
  tags TEXT[], -- Array of tags
  published BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  author TEXT DEFAULT 'Ian Burrett',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_published_date ON articles(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_articles_tags ON articles USING GIN(tags);

-- Enable Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (in case you're re-running)
DROP POLICY IF EXISTS "Articles are publicly readable" ON articles;
DROP POLICY IF EXISTS "Only admins can insert articles" ON articles;
DROP POLICY IF EXISTS "Only admins can update articles" ON articles;
DROP POLICY IF EXISTS "Only admins can delete articles" ON articles;

-- Create RLS policies for articles
-- Public read access (only published articles)
CREATE POLICY "Articles are publicly readable"
  ON articles FOR SELECT
  USING (published = TRUE);

-- Admin write access (authenticated users can manage)
CREATE POLICY "Only admins can insert articles"
  ON articles FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only admins can update articles"
  ON articles FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can delete articles"
  ON articles FOR DELETE
  USING (auth.role() = 'authenticated');

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_articles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before update
DROP TRIGGER IF EXISTS articles_updated_at_trigger ON articles;
CREATE TRIGGER articles_updated_at_trigger
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_articles_updated_at();

-- ============================================================================
-- DONE!
-- ============================================================================
-- After running this SQL, run the migration script:
-- node backend/supabase/migrate-articles.js
-- ============================================================================
