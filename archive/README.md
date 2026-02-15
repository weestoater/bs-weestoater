# Archive

This folder contains files that were used during migration but are no longer needed for the active application.

## Contents

### `/supabase-config/`

Original WeeGym Supabase configuration that was used as reference when setting up the BS WeeStaater backend. All active configuration has been moved to `/backend/supabase/`.

## Backend Migration Scripts Archive

The following files in `/backend/supabase/archive/` were one-time migration scripts:

- **migrate-articles.js** - Migrated 18 articles from TSX files to Supabase database (completed)
- **migrate-books.js** - Migrated books data to Supabase database (completed)
- **schema-articles-only.sql** - Intermediate schema used during articles migration phase

All migrations have been completed successfully. The active database schema is in `/backend/supabase/schema.sql`.

---

**Last Updated:** February 15, 2026
**Status:** Migration complete - these files are archived for reference only
