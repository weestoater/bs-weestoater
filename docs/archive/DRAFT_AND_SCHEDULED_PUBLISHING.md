# This file has been archived as of February 2026. Please refer to the new documentation in the main docs/ folder for up-to-date information.

# Draft Articles & Scheduled Publishing Implementation

## Overview

I've successfully implemented draft article functionality and scheduled publishing for your blog. Articles can now be:

- **Saved as drafts** (unpublished, only visible to admins)
- **Published immediately** (visible to public right away)
- **Scheduled for future publishing** (published but with a future date/time, only visible after that date)

## What Was Changed

### 1. Database Schema (Migration Required)

**File:** `backend/supabase/migration-scheduled-publishing.sql`

Added a new `publish_at` TIMESTAMPTZ column to the articles table that allows scheduling articles for future publishing. The migration also:

- Updates the RLS (Row Level Security) policy to allow authenticated admins to see all articles (including drafts)
- Filters public views to only show published articles where `publish_at` is NULL (immediate) or in the past
- Creates an index on `publish_at` for efficient querying

### 2. TypeScript Interfaces

**Files:**

- `src/interfaces/Article.ts`
- `backend/index.d.ts`

Added `publish_at?: string` field to the Article interface.

### 3. Article Editor UI

**File:** `src/pages/admin/ArticleEditor.tsx`

Enhanced the article editor form with:

- Existing "Published" checkbox to toggle draft/published status
- **NEW:** "Schedule Publishing" datetime picker (only shown when published is checked)
- Helper text explaining: "Leave empty to publish immediately. Set a future date/time to schedule publishing."
- Automatic formatting of the publish_at field to ISO timestamp format

### 4. Database Filtering Logic

**File:** `backend/supabase/database.js`

Updated the `getArticles()` and `getArticleBySlug()` functions to:

- For public views (includeUnpublished=false): Only return articles where:
  - `published = true` AND
  - `publish_at IS NULL` (immediate publish) OR `publish_at <= NOW()` (schedule date has passed)
- For admin views (includeUnpublished=true): Return all articles regardless of status

### 5. Articles Manager Dashboard

**File:** `src/pages/admin/ArticlesManager.tsx`

Added intelligent status badges showing:

- **Draft** (gray badge) - Article is unpublished
- **Scheduled: [date time]** (yellow badge) - Article is published but scheduled for future
- **Published** (green badge) - Article is published and live

## How to Use

### 1. Run the Database Migration (REQUIRED)

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Open and run `backend/supabase/migration-scheduled-publishing.sql`
4. Verify the migration was successful

**Important:** Without this migration, the new features will not work!

### 2. Saving Draft Articles

1. Go to the Article Editor
2. Uncheck the "Published" checkbox
3. Save the article
4. The article will be saved as a draft and only visible to you in the admin dashboard

### 3. Publishing Immediately

1. Go to the Article Editor
2. Check the "Published" checkbox
3. Leave the "Schedule Publishing" datetime field empty
4. Save the article
5. The article will be immediately visible to the public

### 4. Scheduling for Future Publishing

1. Go to the Article Editor
2. Check the "Published" checkbox
3. Set a future date and time in the "Schedule Publishing" field
4. Save the article
5. The article will not be visible to the public until the scheduled date/time
6. In the admin dashboard, you'll see a yellow badge showing when it's scheduled to publish

## Technical Details

### RLS Policy Changes

**Before:**

```sql
CREATE POLICY "Articles are publicly readable"
  ON articles FOR SELECT
  USING (published = TRUE);
```

**After:**

```sql
CREATE POLICY "Articles are publicly readable"
  ON articles FOR SELECT
  USING (
    (published = TRUE AND (publish_at IS NULL OR publish_at <= NOW()))
    OR
    auth.role() = 'authenticated'
  );
```

This allows:

- Public users to only see published articles that have reached their publish_at date
- Authenticated admins to see ALL articles (drafts, scheduled, published)

### Article Status Logic

```typescript
Draft:      published = false
Published:  published = true AND (publish_at = null OR publish_at <= now)
Scheduled:  published = true AND publish_at > now
```

## Testing

All existing tests still pass (21 passing tests). The changes are backward compatible - existing articles without a `publish_at` value will continue to work as before.

## Next Steps

1. **Run the migration** in your Supabase dashboard
2. Test creating a draft article
3. Test scheduling an article for the future
4. Verify scheduled articles don't appear on public pages until their publish date
5. Confirm drafts are only visible in the admin dashboard

## Benefits

 **Draft Workflow** - Save work-in-progress articles without publishing  
 **Scheduled Publishing** - Prepare content in advance and schedule it to go live automatically  
 **Admin Visibility** - Admins can see all articles regardless of status  
 **Public Protection** - Public users only see published articles that are ready to view  
 **Clear Status Indicators** - Easy to see at a glance which articles are drafts, scheduled, or published

## Backward Compatibility

All existing articles will continue to work exactly as before. Articles that don't have a `publish_at` value are treated as "publish immediately" when the published flag is true.


