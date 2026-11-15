# 🟡 In-Flight Work

This folder contains documentation of **active and planned work**.

## Overview

These are the projects currently being worked on or planned for the near future. Each subfolder represents a distinct initiative.

---

## 📁 Subfolders

### 🎯 `strava/` - Strava Activity Tracking Migration
**Status**: Phase 1 ✅ Complete, Phases 2-6 📋 Planned  
**Timeline**: 5-6 weeks total  
**Priority**: High

**Start Here**: [`STRAVA_PHASE_1_READY.md`](strava/STRAVA_PHASE_1_READY.md)

**What it is**: 
- Complete migration of Strava activity tracking from weegym to bs-weestoater
- 6-phase implementation with parallel deployment strategy
- Single athlete design optimized for personal use

**Current Status**:
- ✅ Phase 1: Infrastructure (environment vars, database schema, documentation)
- ✅ Supabase tables created (5 tables + indexes)
- 🟡 PR pending (awaiting credential rotation)
- 📋 Phase 2: Service layer + historical data (9 days, not started)
- 📋 Phase 3: Display components (7 days, not started)
- 📋 Phases 4-6: UI, sync, cutover (not started)

**Key Documents**:
- `STRAVA_PHASE_1_READY.md` - Phase 1 completion & next steps
- `PHASE_1_STATUS.md` - Real-time tracking
- `STRAVA_SETUP.md` - Technical setup guide
- `CUSTOMIZED_MIGRATION_ROADMAP.md` - Full 6-phase plan

**Blocked By**: Credential rotation (security) - see SECURITY_INCIDENT_REPORT.md

---

### 🔄 `refactoring/` - Code Quality & Consolidation
**Status**: 📋 Planning only  
**Priority**: Medium

**What it is**:
- Code consolidation to eliminate duplicates
- DRY principle enforcement
- Performance optimization

**Current Status**:
- 📋 All guides written
- ❌ Phase 2 consolidation not started
- ❌ Phase 3 optimization not started

**Key Documents**:
- `CODE_CONSOLIDATION_GUIDE.md` - Consolidation roadmap
- `REFACTORING_CHECKLIST.md` - Task tracking
- `REFACTORING_INSTRUCTIONS.md` - Step-by-step guide

**Next Steps**: Start after Strava Phase 2 or in parallel if resources allow

---

### 🚀 `deployment/` - Infrastructure & Deployment
**Status**: 📋 Planning only  
**Priority**: Medium

**What it is**:
- Linux deployment requirements
- CI/CD pipeline setup
- Production infrastructure

**Current Status**:
- 📋 Requirements documented
- ❌ Deployment workflow not active

**Key Documents**:
- `LINUX_DEPLOYMENT_REQUIREMENTS.md` - Deployment specs

**Next Steps**: Activate after Phase 2-3 (Strava) are complete

---

### ⚙️ `testing/` - Quality Assurance
**Status**: ⚠️ Active/In-Progress  
**Priority**: High

**What it is**:
- Image upload testing procedures
- Integration testing guides
- Local development testing

**Current Status**:
- ⚠️ Local image upload testing active
- ⚠️ Quick start guides available
- ⚠️ Testing checklist available

**Key Documents**:
- `LOCAL_IMAGE_UPLOAD_TESTING.md` - Testing procedures
- `QUICK_START_IMAGE_UPLOADS.md` - Quick start
- `TEST_IMAGE_UPLOAD_NOW.md` - Testing checklist

---

## 🎯 Quick Navigation

**Working on Strava migration?**
→ Go to: `strava/STRAVA_PHASE_1_READY.md`

**Need to refactor code?**
→ Go to: `refactoring/CODE_CONSOLIDATION_GUIDE.md`

**Setting up deployment?**
→ Go to: `deployment/LINUX_DEPLOYMENT_REQUIREMENTS.md`

**Testing image uploads?**
→ Go to: `testing/QUICK_START_IMAGE_UPLOADS.md`

---

## 📊 Project Status

| Initiative | Phase | Status | Start Date | Estimated End |
|-----------|-------|--------|-----------|---|
| Strava Migration | 1/6 | ✅ Complete | Nov 15 | Dec 15 (est.) |
| Refactoring | 2/3 | 📋 Planned | TBD | TBD |
| Deployment | 1/1 | 📋 Planning | TBD | TBD |
| Testing | - | ⚠️ Active | Ongoing | Ongoing |

---

**For completed work, see**: `../implemented/`  
**For feature guides, see**: `../guides/`  
**For full index, see**: `../INDEX.md`
