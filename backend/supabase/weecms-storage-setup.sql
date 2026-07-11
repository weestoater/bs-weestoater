-- ============================================================================
-- WEECMS STORAGE SETUP
-- ============================================================================
-- Supabase Storage configuration for weeCMS Media Library
-- This sets up a public bucket for all media types (images, videos, documents)
-- ============================================================================

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete media" ON storage.objects;

-- Policy: Anyone can view files in the images bucket
CREATE POLICY "Public can view media"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Policy: Authenticated users can upload files
CREATE POLICY "Admins can upload media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- Policy: Authenticated users can update files
CREATE POLICY "Admins can update media"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- Policy: Authenticated users can delete files
CREATE POLICY "Admins can delete media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ weeCMS storage policies configured!';
  RAISE NOTICE '📁 Bucket: images';
  RAISE NOTICE '🔒 RLS policies: 4 policies created';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Bucket setup:';
  RAISE NOTICE '  ✅ Using existing "images" bucket';
  RAISE NOTICE '  ✅ Ensure "Public bucket" is enabled';
  RAISE NOTICE '  ✅ Recommended file size limit: 10MB';
  RAISE NOTICE '';
  RAISE NOTICE '🎨 Recommended folder structure:';
  RAISE NOTICE '  /images/content-blocks/  - Content block images';
  RAISE NOTICE '  /images/articles/        - Article images';
  RAISE NOTICE '  /images/covers/          - Book covers, banners';
  RAISE NOTICE '  /images/avatars/         - User avatars';
  RAISE NOTICE '  /images/documents/       - PDFs, docs';
  RAISE NOTICE '  /images/videos/          - Video files';
END $$;
