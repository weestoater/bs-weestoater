-- ============================================================================
-- MIGRATION: Add Scheduled Publishing Support
-- ============================================================================
-- This migration adds support for draft articles and scheduled publishing
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- Add publish_at column to articles table
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS publish_at TIMESTAMPTZ;

-- Create index for publish_at for efficient filtering
CREATE INDEX IF NOT EXISTS idx_articles_publish_at ON articles(publish_at) 
WHERE publish_at IS NOT NULL;

-- Update existing published articles to have publish_at set to their published_date
UPDATE articles 
SET publish_at = (published_date || ' 00:00:00')::TIMESTAMPTZ
WHERE published = TRUE AND publish_at IS NULL;

-- Drop the old public read policy
DROP POLICY IF EXISTS "Articles are publicly readable" ON articles;

-- Create new policy that allows:
-- 1. Public to see published articles that are either:
--    - Have no publish_at date (immediate publish)
--    - Have publish_at date in the past (scheduled publish)
-- 2. Authenticated users (admins) to see all articles including drafts
CREATE POLICY "Articles are publicly readable"
  ON articles FOR SELECT
  USING (
    (published = TRUE AND (publish_at IS NULL OR publish_at <= NOW()))
    OR 
    auth.role() = 'authenticated'
  );

-- Add comment to publish_at column
COMMENT ON COLUMN articles.publish_at IS 'Optional: If set, article will only be visible when this datetime is reached. NULL means publish immediately when published=true.';

-- ============================================================================
-- NOTES:
-- ============================================================================
-- - Drafts: Set published = FALSE to save as draft
-- - Publish immediately: Set published = TRUE and leave publish_at = NULL
-- - Schedule publishing: Set published = TRUE and set publish_at to future date
-- - Authenticated users (admins) can see all articles regardless of published status
-- ============================================================================
