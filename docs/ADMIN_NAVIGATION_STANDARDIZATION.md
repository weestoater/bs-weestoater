# Admin Navigation Standardization

## Overview

Standardized the admin section navigation and layout across all admin pages to ensure consistent user experience and easy navigation back to the admin dashboard.

## Changes Made

### 1. Created AdminPageHeader Component

**File**: `src/components/admin/AdminPageHeader.tsx`

A reusable component that provides:

- Consistent page title with icon
- Optional description text
- Breadcrumb navigation showing path from Admin Dashboard → Current Section → Current Item
- Back button to parent section
- Optional action buttons (e.g., "Add New" buttons)
- Standardized layout and styling

**Props**:

- `title`: Page title (required)
- `icon`: Bootstrap icon class (default: "bi-gear-fill")
- `description`: Optional subtitle text
- `backLink`: URL for the back button
- `backLabel`: Text for the back button
- `actions`: React node for action buttons (e.g., "Add New" button)

### 2. Updated Manager Pages

The following manager pages now use AdminPageHeader:

1. **BooksManager** (`src/pages/admin/BooksManager.tsx`)
   - Icon: `bi-book`
   - Back to: Admin Dashboard
   - Action: "Add New Book" button

2. **ArticlesManager** (`src/pages/admin/ArticlesManager.tsx`)
   - Icon: `bi-newspaper`
   - Back to: Admin Dashboard
   - Action: "Add New Article" button

3. **ContentBlocksManager** (`src/pages/admin/ContentBlocksManager.tsx`)
   - Icon: `bi-grid-3x3-gap-fill`
   - Back to: Admin Dashboard
   - Action: "New Content Block" button

4. **SlimmingWorldManager** (`src/pages/admin/SlimmingWorldManager.tsx`)
   - Icon: `bi-heart-pulse`
   - Back to: Admin Dashboard
   - Action: "Add Weigh-In" button

5. **FootballManager** (`src/pages/admin/FootballManager.tsx`)
   - Icon: `bi-trophy`
   - Back to: Admin Dashboard
   - No action button (complex inline actions)

### 3. Updated Editor Pages

The following editor pages now use AdminPageHeader:

1. **BookEditor** (`src/pages/admin/BookEditor.tsx`)
   - Icon: `bi-book`
   - Back to: Books Manager
   - Dynamic title based on edit/create mode
   - Breadcrumb: Admin Dashboard → Books Manager → [Edit/Add] Book

2. **ArticleEditor** (`src/pages/admin/ArticleEditor.tsx`)
   - Icon: `bi-newspaper`
   - Back to: Articles Manager
   - Dynamic title based on edit/create mode
   - Breadcrumb: Admin Dashboard → Articles Manager → [Edit/Add] Article

3. **ContentBlockEditor** (`src/pages/admin/ContentBlockEditor.tsx`)
   - Icon: `bi-grid-3x3-gap-fill`
   - Back to: Content Blocks Manager
   - Dynamic title based on edit/create mode
   - Breadcrumb: Admin Dashboard → Content Blocks Manager → [Edit/Add] Content Block

## Navigation Flow

### Standard Pattern

```
Admin Dashboard
  ├─ Books Manager
  │   ├─ Add New Book
  │   └─ Edit Book
  ├─ Articles Manager
  │   ├─ Add New Article
  │   └─ Edit Article
  ├─ Content Blocks Manager
  │   ├─ New Content Block
  │   └─ Edit Content Block
  ├─ Slimming World Manager
  ├─ Football Manager
  └─ Media Manager (external Supabase Dashboard)
```

### Navigation Features

1. **Breadcrumb Navigation**: Every page shows its path from the admin dashboard
   - Always includes link to Admin Dashboard
   - Shows parent section when applicable
   - Current page shown as active (not clickable)

2. **Back Button**: Every non-dashboard page has a clear back button
   - Manager pages: Back to Admin Dashboard
   - Editor pages: Back to parent Manager page

3. **Consistent Layout**:
   - Page title with icon on the left
   - Actions/back button on the right
   - Description text below title
   - Breadcrumb navigation below header
   - Horizontal rule separator

## Benefits

1. **User Experience**: Users can always find their way back to the admin dashboard or parent section
2. **Consistency**: All admin pages follow the same layout pattern
3. **Maintainability**: Single component to update if navigation design needs changes
4. **Accessibility**: Proper breadcrumb ARIA labels and navigation structure
5. **Visual Clarity**: Clear hierarchy and navigation paths

## Files Modified

- **Created**: `src/components/admin/AdminPageHeader.tsx`
- **Updated**:
  - `src/pages/admin/BooksManager.tsx`
  - `src/pages/admin/ArticlesManager.tsx`
  - `src/pages/admin/ContentBlocksManager.tsx`
  - `src/pages/admin/SlimmingWorldManager.tsx`
  - `src/pages/admin/FootballManager.tsx`
  - `src/pages/admin/BookEditor.tsx`
  - `src/pages/admin/ArticleEditor.tsx`
  - `src/pages/admin/ContentBlockEditor.tsx`

## Testing

✅ Dev server compiles successfully on port 3001
✅ No TypeScript errors
✅ All admin pages updated with consistent navigation
✅ Breadcrumb navigation shows proper hierarchy
