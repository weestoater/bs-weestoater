-- ============================================================================
-- BS WEESTOATER DATABASE SCHEMA
-- ============================================================================
-- This script creates all necessary tables for the BS WeeStaater website
-- Run this in your Supabase SQL Editor to set up the database
--
-- Tables:
--   1. books - Stores book reviews and content
--
-- All tables implement Row Level Security (RLS)
-- ============================================================================

-- ============================================================================
-- 1. BOOKS TABLE
-- ============================================================================

-- Create the books table
CREATE TABLE IF NOT EXISTS books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  description TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_books_order ON books(order_index);
CREATE INDEX IF NOT EXISTS idx_books_published ON books(published);

-- Enable Row Level Security
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Books are publicly readable" ON books;
DROP POLICY IF EXISTS "Only admins can insert books" ON books;
DROP POLICY IF EXISTS "Only admins can update books" ON books;
DROP POLICY IF EXISTS "Only admins can delete books" ON books;

-- Create RLS policies for books
-- Public read access
CREATE POLICY "Books are publicly readable"
  ON books FOR SELECT
  USING (published = TRUE);

-- Admin write access (you can modify this based on your auth setup)
-- For now, we'll allow authenticated users to manage books
-- You should restrict this to admin role in production
CREATE POLICY "Only admins can insert books"
  ON books FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only admins can update books"
  ON books FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can delete books"
  ON books FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_books_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before update
DROP TRIGGER IF EXISTS books_updated_at_trigger ON books;
CREATE TRIGGER books_updated_at_trigger
  BEFORE UPDATE ON books
  FOR EACH ROW
  EXECUTE FUNCTION update_books_updated_at();

-- ============================================================================
-- SEED DATA (Optional - for initial books)
-- ============================================================================

-- Insert initial books if they don't exist
INSERT INTO books (id, title, author, cover_image, description, order_index, published)
VALUES
  (
    'afe',
    'Accessibility for Everyone',
    'Laura Kalbag',
    '/assets/img/kalbag-AFE-cover.jpg',
    '<p>This book is an essential read for anyone involved in creating digital products. Laura Kalbag provides a comprehensive guide to making web content accessible to all users, regardless of their abilities or disabilities.</p><p>With a foreword from the incredible Heydon Pickering you know you''re in good hands. This isn''t a beginners guide by any means, but it certainly one of the best books you can pick up if you have even the slightest intrest in Accessibility.</p><p>By understanding the issues people with disabilities and impairments face, you can better advocate for inclusive design and development practices. In the book you''ll learn how to plan for, evaluate and test accessible design. Leveraging tools and techniques like good information architecture and meaningful HTML to create a solid basis of best practices.</p><p>Like all for the <strong>A Book Apart</strong> publications, this is a joy to read and not at all dry or preaching. Pick up a copy, digital or print and make the web a better place for everyone.</p>',
    1,
    TRUE
  ),
  (
    'czg',
    'The Zen of CSS Design',
    'Dave Shea & Molly E. Holzschlag',
    '/assets/img/shea-tzocd-cover.jpg',
    '<p>This book came about because of the incredibly successfull <a href="http://www.csszengarden.com/" target="_blank" rel="noopener noreferrer">CSS Zen Garden</a> project, which demonstrated the immense power of CSS based design by using a single HTML file styled in multiple ways.</p><p>If anyone ever says CSS is boring show them the site, if they want to know how to do it - give them this book. Each chapter outlines a different factor of the process. The typography, layout, imagery, and more are all covered in detail.</p><p>It too is written in a clear, engaging style, which leads the reader through the different elements with great clarity and ease. A truely enjoyable and uplifting read for those exploring the world of CSS design.</p><p>Written in a time before RWD (Responsive Web Design) became mainstream, it offers timeless insights into CSS design principles. The power of the <em>cascade</em> and inheritance are touched on throughout the book.</p>',
    2,
    TRUE
  ),
  (
    'dwws',
    'Designing with Web Standards',
    'Jeffrey Zeldman',
    '/assets/img/zeldman-dwws-cover.jpg',
    '<p>This is a <strong>must read</strong> for anyone looking to work within the web industry. Whether a designer, developer or project manager, this book covers everything you should be looking for when building internet products.</p><p>Breaking down the fundamentals of web standards and best practices, in a light-hearted but informative manner, Zeldman is a masterful storyteller who makes complex concepts accessible and engaging.</p><p>Owning both 1st and 3rd editions of this book, I highly recommend it to anyone serious about web standards or just building better websites, ones that won''t break on new devices or need constant tweaks and fixes. This is because you''ll be building to the same <strong>standards</strong> that device manufacturers use to ensure compatibility and longevity. Not chasing the latest fad or trend for cool hip design. Content is king and the proper semantics make your content available to way more of an audience than the hipsters.</p><p>To quote the great Guy Martin:</p><blockquote>"Do it right, do it once!<br />If it''s not right, it''s wrong."</blockquote>',
    3,
    TRUE
  )
ON CONFLICT (id) DO NOTHING;
