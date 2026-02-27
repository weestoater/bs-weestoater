
# Supabase CMS Migration Plan

## 📊 Current Content Inventory

**Already Database-Backed:**

- ✅ Books (3 items) - In Supabase

**Ready to Migrate:**

1. **Blog Posts/Articles** (~15-20 items)
   - React posts (6)
   - Agile posts (3)
   - A11y posts (5)
   - Landie posts (2)
   - All use `ArticleMeta` component (great structure!)

2. **Static Cards** (~8 items)
   - Home cards (3)
   - About cards (5)

3. **Structured Data** (Already JSON)
   - Football data (6 seasons)
   - Slimming World data
   - Garmin activities
   - Daily steps

---

## 🎯 Recommended Migration Strategy

### **Phase 1: Blog Posts → Database** (HIGH PRIORITY)

_Most impactful, you already have metadata structure_

**Why First:**

- ✅ Consistent structure with `ArticleMeta`
- ✅ Easy to add new posts remotely
- ✅ Can add features: search, filtering, drafts
- ✅ Builds on books success

**Database Schema:**

```sql
CREATE TABLE articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL, -- 'React', 'Agile', 'A11y', etc.
  content TEXT NOT NULL, -- HTML content
  excerpt TEXT,
  cover_image TEXT,
  published_date DATE NOT NULL,
  reading_time INTEGER,
  tags TEXT[], -- Array of tags
  published BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  author TEXT DEFAULT 'WeeStaater',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Benefits:**

- Write posts from anywhere
- SEO-friendly with meta data
- Easy filtering by category/tags
- Draft management

---

### **Phase 2: Simple CMS Interface** (MEDIUM PRIORITY)

_Enable remote content management_

**Two Approaches:**

#### **Option A: Lightweight Custom Admin** (Recommended)

Build a simple admin interface in your app:

```
/admin (protected route)
├── /articles
│   ├── List articles
│   ├── Create/Edit with rich text editor
│   └── Preview before publish
└── /books
    └── Manage books
```

**Tech Stack:**

- Auth: Supabase Auth (email/password)
- Rich Text Editor: TipTap or React-Quill
- Forms: React Hook Form
- Upload: Supabase Storage for images

**Pros:**

- Full control
- Integrated with your app
- Custom features
- Free hosting

**Cons:**

- Need to build it (~2-3 days work)

#### **Option B: Use Existing Headless CMS**

Integrate with existing CMS:

**Top Options:**

1. **Payload CMS** (Open source, self-hosted)
   - Built on Node.js
   - Rich text editor included
   - Can connect to your Supabase
   - Free

2. **Strapi** (Open source)
   - Popular, mature
   - Good admin UI
   - Can migrate data easily

3. **Supabase Dashboard** (What you have)
   - Already available!
   - Can edit directly in table editor
   - Add custom views
   - Zero setup

**Pros:**

- Ready to use
- Professional UI
- Battle-tested

**Cons:**

- Less customization
- Learning curve
- Possible hosting costs

---

### **Phase 3: Static Cards → Database** (LOW PRIORITY)

_Nice to have, but less urgent_

These change rarely, can stay as components for now, or:

```sql
CREATE TABLE content_blocks (
  id TEXT PRIMARY KEY,
  block_type TEXT NOT NULL, -- 'ethos_card', 'what_is', etc.
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  icon TEXT,
  order_index INTEGER,
  page TEXT NOT NULL, -- 'home', 'about'
  published BOOLEAN DEFAULT TRUE
);
```

---

### **Phase 4: Structured Data → Keep as JSON** (MAINTAIN)

_Football, Slimming World data_

**Recommendation:** Keep as JSON files for now because:

- Already well-structured
- Changes infrequently
- Complex relationships
- Performance optimized

**Future:** Could move to database when you want:

- Web-based data entry
- Real-time updates
- Complex queries

---

## 🚀 Recommended Implementation Path

### **Next 2 Weeks: Quick Win**

1. **Migrate Articles to Database** (3-4 hours)

   ```bash
   # Create schema
   # Extract content from TSX files
   # Insert into Supabase
   # Update React pages to fetch from DB
   ```

2. **Use Supabase Dashboard as CMS** (0 hours!)
   - You already have it!
   - Click "Table Editor" → "articles"
   - Click "Insert row" to add new posts
   - Edit directly in UI

3. **Optional: Add Rich Text Support**
   - Store HTML in `content` column
   - Use `dangerouslySetInnerHTML` (like books)
   - Or use Markdown and convert at runtime

### **Next Month: Build Simple Admin**

If you want more than Supabase dashboard:

```bash
# Create admin routes
src/pages/admin/
  ├── Dashboard.tsx
  ├── ArticlesList.tsx
  ├── ArticleEditor.tsx
  └── Login.tsx

# Add Supabase Auth
# Add TipTap rich text editor
# Deploy admin routes
```

---

## 💡 My Recommendation

**Start with this exact order:**

1. **Week 1:** Migrate React posts to database
   - Easiest to extract (already structured)
   - Immediate value (can write posts remotely)
   - Builds confidence

2. **Week 2:** Migrate Agile + A11y posts
   - Same pattern as React posts
   - Will move faster with experience

3. **Week 3:** Use Supabase Table Editor as your CMS
   - Already works!
   - Add posts directly
   - Good enough for now

4. **Month 2+:** Build custom admin if needed
   - Only if Supabase UI feels limiting
   - By then you'll know exactly what you need

---

## 🛠️ What to Build Next

**Priority Options:**

**A.** Create the articles database schema and migration script
**B.** Build a simple admin interface starter
**C.** Extract and migrate your existing posts to the database
**D.** Set up a rich text editor for content creation

---

## 📁 Current File Structure

```
src/
├── content/
│   ├── a11y/          (5 posts) → Migrate to database
│   ├── about/         (5 cards) → Phase 3 or keep as components
│   ├── agile/         (3 posts) → Migrate to database
│   ├── books/         (DELETED - now in database!)
│   ├── home/          (3 cards) → Phase 3 or keep as components
│   ├── landie/        (2 posts) → Migrate to database
│   └── react/         (6 posts) → Migrate to database
├── data/
│   └── *.json        → Keep as JSON for now
└── pages/
    └── *.tsx         → Update to fetch from database
```

---

## ✅ Success Metrics

After Phase 1 (Articles Migration):

- [ ] Can add new blog posts via Supabase dashboard
- [ ] All existing posts display correctly from database
- [ ] Articles page loads dynamically
- [ ] Can filter/search articles by category
- [ ] Can toggle draft/published status
- [ ] Can edit posts without deploying code

---

## 🔧 Technical Considerations

### Database Design Principles

- Use `TEXT` for primary keys (slugs are readable)
- Add indexes on frequently queried columns
- Use PostgreSQL arrays for tags
- Timestamps for auditing
- Soft deletes with `published` flag

### Content Format Options

1. **HTML** (Current approach for books)
   - Pro: Direct rendering, no conversion
   - Con: Harder to edit

2. **Markdown**
   - Pro: Easy to write, portable
   - Con: Needs runtime conversion

3. **Structured JSON**
   - Pro: Maximum flexibility
   - Con: Complex to edit manually

**Recommendation:** Start with HTML (like books), add Markdown support later.

### Image Management

- Store images in `public/assets/img/` (current approach)
- OR migrate to Supabase Storage for CDN benefits
- Keep image paths relative in database

---

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [TipTap Editor](https://tiptap.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [Payload CMS](https://payloadcms.com/)
- [Strapi](https://strapi.io/)

---

## 🎯 Decision Time

**Quick Start (Recommended):**
Begin with Phase 1, Option A:

- Migrate articles to database
- Use Supabase dashboard as CMS
- Build custom admin later if needed

**Go Big:**
Set up full CMS infrastructure:

- Payload or Strapi
- Rich text editing
- Media library
- Preview functionality

Choose based on:

- Time available
- Comfort with tools
- Long-term vision
