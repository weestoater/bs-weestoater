# Strava Integration Migration Documentation

Complete migration planning package for moving Strava tracking from weegym to bs-weestoater.

---

## 📑 Document Overview

### 1. **MIGRATION_QUICK_START.md** ⭐ START HERE
   - **Who**: You (getting started)
   - **What**: 30-minute quick reference for Phase 1 setup
   - **Contains**: Step-by-step setup instructions, prerequisites, environment variables
   - **Time**: 5-10 min read

### 2. **STRAVA_MIGRATION_PLAN.md** 📋 COMPREHENSIVE PLAN
   - **Who**: Developers implementing the migration
   - **What**: Complete 6-phase migration roadmap
   - **Contains**: 
     - Phase-by-phase breakdown (setup, service layer, auth, components, testing, docs)
     - Architecture recommendations
     - File structure and naming conventions
     - Data migration strategies
     - Risk mitigation
     - Timeline and success criteria
   - **Time**: 20-30 min read

### 3. **BRANCHING_STRATEGY.md** 🌳 GIT WORKFLOW
   - **Who**: Git users managing branches
   - **What**: Detailed branching strategy and workflow guide
   - **Contains**:
     - Visual branch diagrams
     - Step-by-step branch lifecycle (create → develop → merge)
     - Conflict resolution procedures
     - Rebase vs merge decisions
     - PR template and best practices
     - Useful git commands
     - Concurrent development scenarios
   - **Time**: 15-20 min read

---

## 🎯 Quick Navigation by Role

### 👨‍💼 Project Lead / Decision Maker
1. Read: **MIGRATION_QUICK_START.md** (overview section)
2. Skim: **STRAVA_MIGRATION_PLAN.md** (timeline, phases, risk section)
3. Decision: Review strategy and approve Phase 1 setup

### 👨‍💻 Developer Implementing Phase 1 (Setup)
1. Read: **MIGRATION_QUICK_START.md** (complete)
2. Reference: **STRAVA_MIGRATION_PLAN.md** (Phase 1 section)
3. Use: **BRANCHING_STRATEGY.md** (branch lifecycle)

### 👨‍💻 Developer Implementing Phases 2-6
1. Read: **MIGRATION_QUICK_START.md** (overview)
2. Read: **STRAVA_MIGRATION_PLAN.md** (your specific phase)
3. Reference: **BRANCHING_STRATEGY.md** (workflow)
4. Check: Success criteria and verification checklist

### 🔀 Git/DevOps Person
1. Study: **BRANCHING_STRATEGY.md** (complete)
2. Reference: **STRAVA_MIGRATION_PLAN.md** (phase sequencing)
3. Create: PR template and CI/CD configuration

---

## 📊 Migration At a Glance

| Phase | Duration | Branch | Status | Dependencies |
|-------|----------|--------|--------|---|
| 1. Setup | 5 days | `feature/strava-setup` | ⏳ Not started | None |
| 2. Service Layer | 7 days | `feature/strava-service-layer` | ⏳ Blocked | Phase 1 |
| 3. Auth Flow | 5 days | `feature/strava-auth-flow` | ⏳ Blocked | Phase 1-2 |
| 4. Components | 10 days | `feature/strava-components` | ⏳ Blocked | Phase 1-2 |
| 5. Testing | 7 days | `feature/strava-testing` | ⏳ Blocked | Phase 1-4 |
| 6. Docs & Deploy | 4 days | `feature/strava-docs` | ⏳ Blocked | Phase 1-5 |
| **Total** | **~3-4 weeks** | | | |

---

## 🏗️ Architecture Summary

```
Strava Integration = Service Layer + Components + Pages

┌─────────────────────────────────────────────────────┐
│  Pages (StravaConnect, StravaActivities, etc.)     │
├─────────────────────────────────────────────────────┤
│  Components (ActivityCard, StatsSummary, Maps, etc.)│
├─────────────────────────────────────────────────────┤
│  Hooks (useStravaAuth, useStravaActivities)         │
├─────────────────────────────────────────────────────┤
│  Services (stravaService.ts)                        │
│    - OAuth token management                        │
│    - Activity sync from Strava API                  │
│    - Data persistence to Supabase                   │
├─────────────────────────────────────────────────────┤
│  Utils (formatDistance, estimateCalories, etc.)    │
├─────────────────────────────────────────────────────┤
│  Types (StravaActivity, StravaToken, etc.)         │
├─────────────────────────────────────────────────────┤
│  Database (Supabase - already available)            │
│    - strava_activities                              │
│    - strava_tokens                                  │
│    - strava_personal_records                        │
│    - strava_athlete_stats                           │
└─────────────────────────────────────────────────────┘
```

---

## ✅ Pre-Migration Checklist

Before starting Phase 1:

- [ ] Read MIGRATION_QUICK_START.md
- [ ] Have Strava API credentials ready (client ID, secret)
- [ ] Access to bs-weestoater Supabase project
- [ ] Access to weegym repo for reference
- [ ] Node.js >=18 installed
- [ ] Yarn 1.22+ installed
- [ ] Git configured with your name/email
- [ ] GitHub account with push access
- [ ] ~3-4 weeks of development time estimated

---

## 🚀 Getting Started (5 Minutes)

```bash
# 1. Understand the plan
cat README.md                          # (this file)
cat MIGRATION_QUICK_START.md          # Read this next

# 2. Create Phase 1 branch
cd /Users/ian/git/bs-weestoater
git checkout -b feature/strava-setup

# 3. Follow Phase 1 steps in MIGRATION_QUICK_START.md
# - Add environment variables
# - Set up Supabase schema
# - Create initial documentation

# 4. Commit and create PR
git add .
git commit -m "chore(strava): setup migration infrastructure"
git push -u origin feature/strava-setup
```

---

## 📈 Phases Explained (TL;DR)

### Phase 1: Setup (5 days)
Prepare the infrastructure: environment variables, database schema, documentation.
**Output**: Ready to start development

### Phase 2: Service Layer (7 days)
Port the core Strava service from JavaScript to TypeScript. Create type definitions and utility functions.
**Output**: TypeScript service layer with full API coverage

### Phase 3: Authentication (5 days)
Implement OAuth flow: connect, callback, token management, user session.
**Output**: Users can connect their Strava account

### Phase 4: Components & UI (10 days)
Build React components for displaying activities, analytics, personal records.
**Output**: Full UI with activity viewing and analytics dashboards

### Phase 5: Testing (7 days)
Unit tests, component tests, E2E tests, accessibility compliance.
**Output**: Production-ready with >80% test coverage

### Phase 6: Documentation & Deployment (4 days)
Write guides, create deployment checklist, final QA.
**Output**: Ready for deployment to production

---

## 🎯 Success Criteria

All must be complete for migration to be considered successful:

✅ **Feature Parity**
- All weegym Strava features working in bs-weestoater
- Same data accuracy
- Same user workflows

✅ **Code Quality**
- Full TypeScript strict mode compliance
- >80% test coverage
- Zero ESLint warnings
- WCAG 2.2 AA accessibility compliance

✅ **Performance**
- Page load <2 seconds with 1000+ activities
- Component render <100ms
- No memory leaks
- Bundle size impact <50KB

✅ **Documentation**
- Developer guide complete
- User guide complete
- All APIs documented with examples
- Troubleshooting guide available

✅ **Deployment**
- Zero downtime for existing features
- Rollback plan documented and tested
- Monitoring/alerts configured
- All CI/CD tests passing

---

## 📞 Key Resources

### External Documentation
- **Strava API**: https://developers.strava.com/docs/
- **Supabase**: https://supabase.com/docs
- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs

### Internal References
- **weegym Strava Service**: `/Users/ian/git/weegym/src/services/stravaService.js`
- **weegym Components**: `/Users/ian/git/weegym/src/pages/` (Strava*)
- **bs-weestoater Structure**: `/Users/ian/git/bs-weestoater/src/`
- **Project Docs**: `/Users/ian/git/bs-weestoater/docs/`

---

## 🔄 Continuous Updates

These documents should evolve as the migration progresses:

- After each phase completes, update status table above
- Log any unexpected challenges or learnings
- Update estimated timelines based on actual progress
- Add troubleshooting items as they arise
- Refine phase checklist based on experience

---

## ❓ Questions?

Before you start, clarify these decisions:

1. **Athlete Data**: Just your activities or multi-user support?
2. **Historical Data**: Migrate all weegym data or start fresh?
3. **Features**: Must-have vs nice-to-have from weegym?
4. **Segments**: Include Strava segment data?
5. **Mobile**: Full responsive mobile-first design?
6. **Real-time**: Auto-sync new activities or manual refresh?
7. **Archival**: Keep weegym running in parallel?

See "Questions to Clarify" in STRAVA_MIGRATION_PLAN.md

---

## 📋 Document Version Info

- **Created**: November 2024
- **Scope**: bs-weestoater Strava migration
- **Source Projects**: weegym → bs-weestoater
- **Estimated Effort**: 3-4 weeks
- **Team Size**: 1 developer (can be parallelized)

**Next Document to Read**: [MIGRATION_QUICK_START.md](./MIGRATION_QUICK_START.md)
