# BS-Weestoater Architecture Documentation

## 1. Overview

BS-Weestoater is a modular, data-driven web application for tracking football statistics, weight loss (Slimming World), and fitness activities (Garmin). It is built with React, TypeScript, Vite, Supabase, and AG Charts, and follows modern best practices for maintainability, scalability, and performance.

---

## 2. System Context & High-Level Architecture

- **Frontend:** React 18+, TypeScript, Vite, Bootstrap 5, AG Charts
- **Backend:** Supabase (PostgreSQL, Auth, Storage), Node.js scripts for migration and sync
- **Data:** JSON files (historical), Supabase tables (current), API integration (Garmin)
- **Testing:** Vitest (unit), Playwright (E2E), GitHub Actions (CI/CD)

### Diagram: System Context

```mermaid
graph TD
    User[User]
    Browser[Browser]
    ReactApp[React App (Vite, TypeScript)]
    Supabase[Supabase DB & Auth]
    JSON[Local JSON Data]
    Scripts[Node.js Scripts]
    Garmin[Garmin Connect API]

    User --> Browser
    Browser --> ReactApp
    ReactApp -->|Fetch| Supabase
    ReactApp -->|Import| JSON
    Scripts -->|Migrate| Supabase
    Scripts -->|Sync| JSON
    Scripts -->|Sync| Supabase
    ReactApp -->|API| Garmin
```

---

## 3. Section-by-Section Architecture

### 3.1 Football Section
- **Purpose:** Track football match results, goals, and player stats for Motherwell FC.
- **Data:**
  - Historical: JSON files per season (matches, goals)
  - Current: Supabase tables (seasons, matches, goals, cards, stats)
- **Key Components:**
  - `FootballSeasonResults`, `MatchDetails`, `GoalScorerDetails`, `FootballSeasonsNav`
- **Data Flow:**
  - Loads from Supabase (or JSON fallback)
  - Data transformed to TypeScript interfaces
  - Rendered via modular React components
- **Testing:** Unit tests for utils, E2E for navigation and data display

### 3.2 Slimming World Section
- **Purpose:** Track weight loss progress, visualize trends, and manage weigh-in data.
- **Data:**
  - Historical: JSON file (`slimmingWorldData.json`)
  - Current: Supabase tables (profiles, entries)
- **Key Components:**
  - `SlimmingWorld`, `SWDataTable`, `WeightConverter`, `AgCharts`
- **Data Flow:**
  - Loads from Supabase (or JSON fallback)
  - Chart config generated dynamically
  - Responsive Bootstrap layout
- **Testing:** Unit tests for conversion, E2E for data visualization

### 3.3 Garmin Activities Section
- **Purpose:** Display and analyze fitness activities from Garmin Connect.
- **Data:**
  - Manual: JSON file (`garminActivities.json`)
  - Auto-sync: Supabase table (`garmin_activities`)
- **Key Components:**
  - `useGarminActivities` hook, activity cards, summary charts
- **Data Flow:**
  - Node.js script syncs activities from Garmin API
  - Data loaded from Supabase or JSON
- **Testing:** E2E for sync and display, unit tests for data transformation

---

## 4. Data Structures & Interfaces

### 4.1 Football
```typescript
export interface Match {
  date: string;
  opposition: string;
  venue: 'Home' | 'Away';
  scored: number;
  conceded: number;
  league?: string;
  video?: string;
  goals?: MatchGoal[];
  cards?: MatchCard[];
  notes?: string;
}
export interface MatchGoal {
  player: string;
  mins: number;
  assist?: string;
}
export interface MatchCard {
  player: string;
  type: 'yellow' | 'red';
  minute: number;
}
export interface GoalScorer {
  player: string;
  goals: number;
  assists: number;
}
```

### 4.2 Slimming World
```typescript
export interface SwDataPoint {
  date: string;
  weight: number;
  lost: number;
  target: number;
  sotw?: number;
}
export interface SwData {
  startDate: string;
  startWeight: number;
  targetWeight: number;
  data: SwDataPoint[];
}
```

### 4.3 Garmin Activities
```typescript
export interface GarminActivity {
  id: string;
  date: string;
  type: 'running' | 'cycling' | 'walking' | 'swimming' | 'other';
  distance: number;
  duration: number;
  calories?: number;
  averageHeartRate?: number;
  maxHeartRate?: number;
  averagePace?: number;
  elevation?: number;
  steps?: number;
  notes?: string;
}
```

---

## 5. Technology Stack & Dependencies

- **Frontend:** React, TypeScript, Vite, Bootstrap, AG Charts
- **Backend:** Supabase (Postgres, Auth, Storage), Node.js
- **Testing:** Vitest, Playwright, ESLint
- **CI/CD:** GitHub Actions
- **Other:** Custom Node.js scripts for data migration and sync

---

## 6. Component & Folder Structure

```
src/
├── components/
│   ├── football/
│   ├── sw/
│   └── ...
├── config/
├── content/
├── data/
├── hooks/
├── interfaces/
├── pages/
├── utils/
├── css/ or scss/
```
- **components/**: Modular UI components by domain
- **config/**: Chart and section configuration
- **content/**: Static and dynamic content
- **data/**: JSON data files (legacy, fallback)
- **hooks/**: Custom React hooks
- **interfaces/**: TypeScript type definitions
- **pages/**: Route-level components
- **utils/**: Shared utility functions
- **css/scss/**: Styling

---

## 7. Data Flow & Processing

- **Data import:** Static JSON (legacy) or Supabase fetch (current)
- **Transformation:** Data mapped to TypeScript interfaces
- **Display:** Modular React components render data
- **Sync:** Node.js scripts migrate/sync data between JSON, Supabase, and APIs

---

## 8. Testing & CI/CD

- **Unit Tests:** Vitest for all core logic and components
- **E2E Tests:** Playwright for user flows and integration
- **Type Safety:** TypeScript for compile-time validation
- **CI/CD:** GitHub Actions for lint, test, build, deploy

---

## 9. Extensibility & Best Practices

- **Modular design:** Each section is self-contained and testable
- **Type safety:** All data structures are strongly typed
- **Responsive:** Bootstrap grid and custom SCSS for mobile-first design
- **Performance:** Lazy loading, memoization, static imports
- **Security:** Environment variables for secrets, RLS in Supabase
- **Documentation:** All code and data structures documented inline

---

## 10. Diagrams & References

- **Architecture diagrams:** Mermaid diagrams above
- **Data flow:** Sequence diagrams in section docs
- **References:**
  - [Supabase Docs](https://supabase.com/docs)
  - [React Docs](https://react.dev/)
  - [AG Charts Docs](https://charts.ag-grid.com/)
  - [Bootstrap Docs](https://getbootstrap.com/)

---

_Last updated: February 2026_
