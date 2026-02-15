-- ============================================================================
-- SUPABASE STORAGE SETUP FOR IMAGE UPLOADS
-- ============================================================================
-- Run this in your Supabase SQL Editor to set up storage for images
-- ============================================================================

-- Create the images bucket (if it doesn't exist)
-- Note: You may need to create this through the Supabase Dashboard:
-- Dashboard > Storage > "Create a new bucket" > Name: "images" > Public: true

-- Note: RLS is already enabled on storage.objects by default in Supabase
-- No need to enable it manually

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update their images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete their images" ON storage.objects;

-- Policy: Anyone can view images in the public bucket
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Policy: Authenticated users can upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- Policy: Authenticated users can update images
CREATE POLICY "Authenticated users can update their images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- Policy: Authenticated users can delete images
CREATE POLICY "Authenticated users can delete their images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- ============================================================================
-- MANUAL STEPS REQUIRED (Do these in Supabase Dashboard):
-- ============================================================================
-- 1. Go to: Dashboard > Storage > Create a new bucket
-- 2. Bucket name: images
-- 3. Public bucket: Yes (checked)
-- 4. File size limit: 5MB (optional)
-- 5. Allowed MIME types: image/* (optional)
-- 
-- After creating the bucket, run the SQL above to set up the policies.
-- ============================================================================
