# Strava Page Layout Guide

This guide explains the layout and features of the weestoater Strava page, inspired by the weegym Strava Activities page.

## Overview

The Strava page (`/strava`) displays imported Strava activities as articles with a summary statistics dashboard and article grid layout.

### Layout Components

#### 1. Summary Statistics Card

Displays aggregate metrics across all Strava activities:

- **Activities**: Total count of published Strava articles
- **Total Distance**: Sum of all activity distances (miles primary, km secondary)
- **Total Time**: Sum of all activity durations (formatted as hours and minutes)
- **Total Calories**: Sum of calories burned across all activities
- **Activity Types**: Breakdown by activity type (Run, Ride, Walk, Hike, etc.)

**Features:**
- **Units Toggle**: Switch between Imperial (mi) and Metric (km) display
- **Responsive Grid**: 4 columns on desktop, 2 on tablet, 1 on mobile
- **Icons**: Bootstrap Icon symbols for visual clarity
- **Color Coding**: 
  - Primary color for distance/time/activities
  - Warning color for calories

#### 2. Activity Type Breakdown

Shows count of activities by type as colored badges:

```
Run: 24  |  Ride: 18  |  Walk: 65  |  Swim: 2
```

#### 3. Articles Grid

Displays all Strava articles in a responsive card grid:

- 3 columns on xxl (≥1400px)
- 4 columns on xl (≥1200px)
- 4 columns on lg (≥992px)
- 6 columns on md (≥768px)
- 6 columns on sm (≥576px)
- 12 columns on xs (<576px)

Each article card shows:
- Activity name/title
- Activity type badge with Bootstrap Icon
- Excerpt (distance, duration, elevation)
- Icon indicator for activity type

### Units and Measurements

#### Distance Display

All distances are shown with **miles as primary, kilometers as secondary**:

```
Format: X.Xmi (Y.Ykm)
Example: "5.2mi (8.4km)"
```

**Conversion:**
- 1 kilometer = 0.621371 miles
- Display precision: 1 decimal place in excerpt, 2 in content

#### Speed Display

All speeds shown in **mph (primary) with km/h (secondary)**:

```
Format: Z.Z mph (A.A km/h)
Example: "6.8 mph (11.0 km/h)"
```

**Conversion:**
- Speed stored in Strava API as meters/second (m/s)
- 1 m/s = 2.237 mph = 3.6 km/h

#### Elevation Display

All elevations shown in **feet (primary) with meters (secondary)**:

```
Format: +AAAFT (+BBBm)
Example: "+1250ft (+381m)"
```

**Conversion:**
- 1 meter = 3.28084 feet
- Elevation values from Strava API in meters

#### Time Display

- **Duration**: "XYmin" (minutes) or "Zh YYm" (hours and minutes)
- **Reading Time**: Calculated from distance in miles
  - Formula: `ceil(miles / 2)`, minimum 2 minutes, maximum 30 minutes
  - Used in article metadata for estimated reading time

### Statistics Calculation

Stats are calculated from article data on page load:

```typescript
interface ActivityStats {
  totalActivities: number;
  totalDistance: number; // in miles
  totalDuration: number; // in minutes
  totalCalories: number;
  activityTypes: { [key: string]: number };
}
```

**Extraction Logic:**

1. **Total Activities**: Count of articles with category "Strava"
2. **Total Distance**: Parsed from article excerpts using regex
   - Pattern: `(\d+\.?\d*)mi` (miles from excerpt)
3. **Total Duration**: Parsed from article excerpts
   - Pattern: `in (\d+)min` (minutes from excerpt)
4. **Total Calories**: Parsed from article HTML content
   - Pattern: `<p><strong>Calories:</strong> (\d+)</p>`
5. **Activity Types**: Extracted from article tags array
   - Tags stored as `ARRAY['Run']`, `ARRAY['Ride']`, etc.

### Future Enhancements

#### Interactive Route Maps

The weegym Strava Activities page displays interactive Leaflet maps showing the route taken during each activity. To implement this in weestoater:

**Requirements:**
1. Store polyline/coordinate data in articles (new optional field)
2. Import route coordinates from weegym's `strava_activities.polyline` field
3. Add lazy-loaded RouteMap component (similar to weegym)
4. Display maps in expandable article detail view

**Libraries:**
- Leaflet.js for map rendering
- OpenStreetMap tiles for basemap

**Implementation Steps:**
1. Add `route_polyline` field to articles table (optional, text)
2. Update SQL import to include encoded polylines
3. Create RouteMap component in components/strava/
4. Add expandable detail view in ArticleCard or new StravaActivityDetail page
5. Lazy-load Leaflet CSS/JS to avoid performance impact

#### Date Range & Type Filters

The weegym page includes filters for:
- **Date Range**: Last 30 days, 3 months, 1 year, all time
- **Activity Type**: Filter to specific activity types
- **Dynamic Stats**: Update statistics based on filters

**Implementation:**
1. Add filter state to StravaPage component
2. Implement date range filtering in getArticles query
3. Add filter UI controls (dropdowns/buttons)
4. Recalculate stats when filters change

### Styling

The Strava page uses Bootstrap 5 classes and utility styles:

- `.card` for summary statistics container
- `.row.g-3` for responsive grid layout
- `.badge` for activity type breakdown
- `.text-center` for stat columns
- `.text-muted` for secondary/helper text

Color scheme:
- Primary (`text-primary`): Distance, time, count metrics
- Danger (`text-danger`): Heart rate indicators
- Warning (`text-warning`): Calories

### Accessibility

The Strava page maintains WCAG 2.2 AA compliance:

- `role="status"` on article count paragraph for screen readers
- Semantic HTML with proper heading hierarchy
- Alt text implied through Bootstrap Icon titles
- Color contrast ratios meet WCAG AA standards
- Responsive design accessible on all screen sizes
- Form controls (units toggle) properly labeled

### Performance Considerations

- Statistics calculated on page load (one-time cost)
- No live API calls needed (uses imported article data)
- Lazy loading of article images via ArticleCard component
- Responsive grid optimized for all viewport sizes

### Database Schema

Articles are stored with the following relevant fields:

```sql
CREATE TABLE articles (
  id TEXT PRIMARY KEY,
  title TEXT,
  slug TEXT UNIQUE,
  category TEXT, -- "Strava"
  content TEXT,  -- HTML with metrics
  excerpt TEXT,  -- "X.Xmi (Y.Ykm) in ZZmin +AAaft (BBBm)"
  icon TEXT,     -- "bi-person-running", etc.
  published_date DATE,
  reading_time INTEGER,
  tags TEXT[],   -- ARRAY['Run'], ARRAY['Ride'], etc.
  published BOOLEAN,
  featured BOOLEAN,
  author TEXT,   -- "Strava Import"
  order_index INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## See Also

- [Strava Export/Import Guide](/docs/guides/admin/STRAVA_EXPORT_IMPORT.md)
- [Articles Management](/admin/articles)
- [weegym StravaActivities Component](https://github.com/weestoater/weegym/src/pages/StravaActivities.jsx)
