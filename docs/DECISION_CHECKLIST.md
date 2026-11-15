# Pre-Migration Decision Checklist

Complete this checklist before starting Phase 1. These decisions impact architecture, timeline, and resource requirements.

---

## 🎯 Scope & Features

### Athlete Data
- [ ] **Decision**: Single athlete (just me) OR Multi-athlete support
  - **Single Athlete**: Simpler schema, faster development (Recommend for Phase 1)
  - **Multi-athlete**: More complex auth, sharing features (Phase 2+ enhancement)
  - **Impact**: Database schema, authentication layer
  - **Chosen**: ___________________________________

### Historical Data Migration
- [ ] **Decision**: Migrate ALL weegym activities OR Start fresh
  - **All Data**: More initial work, but complete history (1-2 weeks added)
  - **Start Fresh**: Clean slate, faster to MVP, can import later
  - **Impact**: Data migration scripts, initial sync time, testing volume
  - **Chosen**: ___________________________________

### Feature Priority (rank 1-7, 1=highest)
- [ ] _____ Activity browsing & filtering
- [ ] _____ Analytics dashboard (stats, charts)
- [ ] _____ Personal records tracking
- [ ] _____ Activity maps & visualization
- [ ] _____ Strava segment data
- [ ] _____ Social features (kudos, comments sync)
- [ ] _____ Export/reporting capabilities

---

## 🏗️ Architecture Decisions

### Strava Segments & Leaderboards
- [ ] **Decision**: Include Strava segment data OR Activities only
  - **Segments**: Additional API calls, more data processing, advanced features
  - **Activities Only**: Simpler implementation, focus on core features
  - **Impact**: Service layer complexity, database schema
  - **Chosen**: ___________________________________

### Authentication Approach
- [ ] **Decision**: Strava OAuth only OR OAuth + manual token management
  - **OAuth Only**: User-driven, secure, simpler (Recommend)
  - **Manual Tokens**: Admin stores tokens server-side, more control (enterprise use)
  - **Impact**: Service layer, security considerations, UX
  - **Chosen**: ___________________________________

### Real-time Activity Sync
- [ ] **Decision**: Auto-sync new activities OR Manual refresh only
  - **Auto-sync**: More complex (webhooks/polling), always current (Phase 2+ feature)
  - **Manual**: User clicks sync button, simpler, sufficient for MVP
  - **Impact**: Backend complexity, infrastructure needs
  - **Chosen**: ___________________________________

### UI/UX Approach
- [ ] **Decision**: Mobile-first responsive OR Desktop-first then responsive
  - **Mobile-first**: Better for mobile users, takes more care with layout
  - **Desktop-first**: Faster initial development, responsive as secondary
  - **Impact**: CSS/component approach, testing effort
  - **Chosen**: ___________________________________

---

## 📊 Data & Integration

### Display Preferences
- [ ] **Metric System**: Kilometers OR Miles (or both with toggle)
  - **Impact**: Formatting functions, user preferences storage
  - **Chosen**: ___________________________________

- [ ] **Time Format**: 12-hour OR 24-hour (or system default)
  - **Impact**: Utility functions, user preferences
  - **Chosen**: ___________________________________

### Data Retention
- [ ] **Decision**: Keep ALL activity history OR Archive old activities (e.g., >1 year)
  - **Keep All**: No data loss, but database grows, queries slower
  - **Archive**: Better performance, but requires archive strategy
  - **Impact**: Database performance, storage needs, compliance
  - **Chosen**: ___________________________________

### Privacy & Sharing
- [ ] **Decision**: Private activities OR Allow public sharing
  - **Private Only**: Simpler, respects athlete privacy
  - **Public Sharing**: More features, requires access controls
  - **Impact**: Database schema, permissions, UI complexity
  - **Chosen**: ___________________________________

---

## 🚀 Deployment & Operations

### Deployment Strategy
- [ ] **Decision**: Keep weegym running OR Full migration cutover
  - **Keep Parallel**: Run both apps temporarily, gradual cutover (Lower risk)
  - **Full Cutover**: Switch completely on day X (Higher risk, simpler ops)
  - **Impact**: User communication, testing scope, rollback needs
  - **Chosen**: ___________________________________

### Monitoring & Logging
- [ ] **Log Level**: Minimal (errors only) OR Detailed (all API calls)
  - **Minimal**: Production-ready, less noise
  - **Detailed**: Better for debugging, more storage
  - **Impact**: Storage, performance, debugging capability
  - **Chosen**: ___________________________________

- [ ] **Error Tracking**: Log to console only OR Send to Sentry/LogRocket
  - **Console**: Minimal setup, no external service
  - **External Service**: Better for production monitoring, need subscription
  - **Impact**: Error observability, cost
  - **Chosen**: ___________________________________

---

## 📈 Performance Targets

### Activity Load Count
- [ ] **Expected Activities**: _________
- [ ] **Performance Target**: Load and display _______ activities in < 2 seconds
- [ ] **Impact**: Pagination strategy, caching approach

### Page Load Target
- [ ] **Target**: _______ seconds (recommend <2s)
- [ ] **Analytics Dashboard**: _______ seconds
- [ ] **Activity List**: _______ seconds

---

## 🧪 Testing & Quality

### Test Coverage Target
- [ ] **Unit Tests**: >80% coverage (recommend)
- [ ] **Component Tests**: Core components tested
- [ ] **E2E Tests**: Critical user flows
- [ ] **A11y Tests**: WCAG 2.2 AA compliance (requirement)

### Browsers to Support
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## 🎓 Documentation Requirements

### Developer Documentation
- [ ] _____ API reference for stravaService
- [ ] _____ Component usage examples
- [ ] _____ Setup & configuration guide
- [ ] _____ Testing guide
- [ ] _____ Troubleshooting guide
- [ ] _____ Architecture decision log

### User Documentation
- [ ] _____ How to connect Strava account
- [ ] _____ How to view activities
- [ ] _____ How to interpret analytics
- [ ] _____ FAQ & troubleshooting
- [ ] _____ Privacy & data usage

---

## ⚠️ Risk Assessment

Rate each risk (1=very low, 5=very high):

| Risk | Rating | Mitigation |
|------|--------|-----------|
| OAuth token expiration issues | ___/5 | Strong refresh logic + testing |
| Data loss during migration | ___/5 | Backup DB before migration |
| Strava API changes | ___/5 | Pin API version, monitor changelog |
| Performance degradation | ___/5 | Pagination, caching, testing |
| User experience disruption | ___/5 | Parallel running, gradual cutover |
| Mobile responsiveness issues | ___/5 | Mobile-first testing throughout |

**Highest Risk Item**: _________________________________
**Mitigation Strategy**: _________________________________

---

## 💰 Resource Planning

### Time Allocation
- [ ] **Phase 1 (Setup)**: _____ hours (estimate 5 days = 40 hours)
- [ ] **Phase 2 (Service)**: _____ hours (estimate 7 days = 56 hours)
- [ ] **Phase 3 (Auth)**: _____ hours (estimate 5 days = 40 hours)
- [ ] **Phase 4 (Components)**: _____ hours (estimate 10 days = 80 hours)
- [ ] **Phase 5 (Testing)**: _____ hours (estimate 7 days = 56 hours)
- [ ] **Phase 6 (Docs)**: _____ hours (estimate 4 days = 32 hours)
- [ ] **Total**: _____ hours (estimate 3-4 weeks = ~300 hours)

### Development Environment
- [ ] Node.js version: _____ (minimum 18.0.0)
- [ ] Yarn version: _____ (minimum 1.22.0)
- [ ] Editor: VS Code / Other: _____________
- [ ] Browser for testing: Chrome + _____________

---

## 🎬 Start Date & Schedule

### Project Dates
- [ ] **Start Date**: _________________
- [ ] **Target Phase 1 Complete**: _________________
- [ ] **Target Phase 2-3 Complete**: _________________
- [ ] **Target Full Completion**: _________________

### Weekly Schedule
- [ ] **Development Hours Per Week**: _____ hours
- [ ] **Testing/Review Time**: _____ hours per week
- [ ] **Days/Hours Available Per Day**: _________________

---

## ✅ Final Approval Checklist

Before starting Phase 1, verify:

- [ ] All scope questions answered above
- [ ] Architecture decisions made and documented
- [ ] Resource allocation confirmed
- [ ] Timeline realistic and approved
- [ ] Risk assessment complete
- [ ] Strava API credentials obtained
- [ ] Supabase project accessible
- [ ] weegym code reviewed for reference
- [ ] Development environment set up
- [ ] Team/stakeholders informed of plan

---

## 📝 Sign-Off

**Migration Owner**: _________________________________
**Date**: _________________________________
**Notes/Comments**: 
```
_________________________________________________________________

_________________________________________________________________

_________________________________________________________________
```

---

## 🚀 Ready to Start Phase 1?

When all checkboxes above are complete:

```bash
cd /Users/ian/git/bs-weestoater
git checkout -b feature/strava-setup
# Follow MIGRATION_QUICK_START.md
```

**Next Document**: MIGRATION_QUICK_START.md
