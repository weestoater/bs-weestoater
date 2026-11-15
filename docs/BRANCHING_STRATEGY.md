# Git Branching Strategy for Strava Migration

## Visual Overview

```
main (production)
├─ (PRs merged from feature branches)
├─ │
├─ feature/strava-setup ──┐ (Phase 1: 5 days)
│  │                       └─→ DB schema, env setup, audit
│  │
├─ feature/strava-types ──┐ (Phase 2a: 3 days)
│  │                       └─→ TypeScript interfaces
│  │
├─ feature/strava-service-layer ──┐ (Phase 2b: 7 days)
│  │                               └─→ Service port to TS
│  │
├─ feature/strava-auth-flow ──┐ (Phase 3: 5 days)
│  │                           └─→ OAuth, callback, tokens
│  │
├─ feature/strava-components ──┐ (Phase 4: 10 days, parallel with 3)
│  │                            └─→ UI components, pages
│  │
├─ feature/strava-testing ──┐ (Phase 5: 7 days, parallel with 4)
│  │                         └─→ Unit, E2E, a11y tests
│  │
└─ feature/strava-docs ──┐ (Phase 6: 4 days, final)
                         └─→ Documentation, deployment prep

Note: Branches can overlap (rebase frequently on main)
```

## Branch Lifecycle

### 1. Feature Branch Creation

```bash
# Ensure main is current
git checkout main
git pull origin main

# Create feature branch from main
git checkout -b feature/strava-<component>

# Set up tracking with remote
git push -u origin feature/strava-<component>
```

### 2. Development Workflow

```bash
# Work in increments (commit daily or per feature)
git add <files>
git commit -m "feat: <description>"
git commit -m "fix: <description>"
git commit -m "test: <description>"

# Push frequently to backup
git push

# If main has moved ahead, rebase
git fetch origin
git rebase origin/main

# If conflicts, resolve and continue
git add <resolved-files>
git rebase --continue
```

### 3. Code Review & Merge

```bash
# Create Pull Request on GitHub (when ready for review)
# - Set base: main
# - Set compare: feature/strava-<component>
# - Add description linking to migration plan
# - Add checklist of tasks completed

# After approval and CI/CD passing:
# Option A: Squash merge (simpler history)
git checkout main
git pull origin main
git merge --squash feature/strava-<component>
git commit -m "Merge feature/strava-<component>"
git push origin main

# Option B: Rebase merge (preserves commits)
git checkout main
git pull origin main
git rebase feature/strava-<component> main
git push origin main

# Clean up local and remote
git branch -d feature/strava-<component>
git push origin --delete feature/strava-<component>
```

## Branch Dependencies & Sequencing

```
Phase 1 (Setup)
    ↓
  must complete before phases 2-6

Phase 2a (Types) ──┐
Phase 2b (Service) ┼─→ Phase 3 (Auth)
                   └─→ Phase 4 (Components) [can start in parallel]

Phase 3 (Auth) ────┐
Phase 4 (Components) ┼─→ Phase 5 (Testing)

Phase 5 (Testing) ──┐
                     ├─→ Phase 6 (Docs & Deploy)
                     └─→ Main (Final merge)
```

### Recommended Merge Order
1. `feature/strava-setup` → main (blocks all others)
2. `feature/strava-types` → main (small, safe)
3. `feature/strava-service-layer` → main (core functionality)
4. `feature/strava-auth-flow` → main (authentication)
5. `feature/strava-components` → main (UI)
6. `feature/strava-testing` → main (quality assurance)
7. `feature/strava-docs` → main (documentation)

**Alternative**: If Phase 4 & 5 progress in parallel, you could merge the components first, then testing fixes

## Handling Concurrent Development

### Scenario: Multiple Features in Progress

If Phase 3 and Phase 4 are being worked simultaneously:

```bash
# Developer A (working on feature/strava-auth-flow)
git checkout feature/strava-auth-flow
git fetch origin
git rebase origin/main    # Keep current with main

# Developer B (working on feature/strava-components)
git checkout feature/strava-components
git fetch origin
git rebase origin/main    # Keep current with main

# If Phase 3 merges to main first
# Developer B should update their branch
git fetch origin
git rebase origin/main    # Pull in new auth changes

# This might have conflicts with components expecting auth APIs
# Resolve locally before pushing
git push --force-with-lease origin feature/strava-components
```

### Rebasing Strategy (Recommended)

**Use `rebase` to keep history clean:**

```bash
# Frequently update feature branch with main changes
git fetch origin
git rebase origin/main

# Use --force-with-lease when pushing after rebase
# (safer than --force, won't overwrite others' work)
git push --force-with-lease origin feature/strava-<component>
```

**Avoid merging main into feature branches** (creates messy merge commits)

## Handling Conflicts

### When Conflicts Occur

```bash
git rebase origin/main

# If conflicts found, git will pause and show conflicts
# Example conflict in src/routes.tsx:
#
# <<<<<<< HEAD (your branch)
#   routes for strava
# =======
#   routes from main (some other change)
# >>>>>>> origin/main

# 1. Open file in editor
# 2. Resolve conflicts (combine changes if needed)
# 3. Mark as resolved
git add src/routes.tsx

# 4. Continue rebase
git rebase --continue

# 5. Push (force-with-lease is safe here)
git push --force-with-lease origin feature/strava-<component>
```

### Common Conflict Points
- `src/routes.tsx` - Adding new routes
- `src/App.tsx` - Adding navigation items
- `package.json` - Dependencies (rare if not changing them)
- `.env.example` - New env variables

## Prevention & Best Practices

### 1. Keep Branches Short-Lived
- Max 1-2 weeks of active development
- Merge or rebase frequently (at least 2-3x per week)
- Avoid long divergence from main

### 2. Coordinate with Other Work
- Update `#progress` channel or issue tracker
- Communicate which parts of code you're touching
- Rebase together if working in overlapping areas

### 3. Small, Focused Commits
```bash
# Good: Many small commits
git commit -m "feat: create StravaService interface"
git commit -m "feat: implement token refresh logic"
git commit -m "test: add token refresh tests"

# Avoid: One massive commit
git commit -m "implement entire strava feature"
```

### 4. Pre-Push Checklist
- [ ] Tests pass: `npm run test`
- [ ] Linting passes: `npm run lint`
- [ ] TypeScript compiles: `npm run build`
- [ ] No console errors in dev
- [ ] Commit messages are clear

```bash
# Quick validation before push
npm run lint && npm run test && npm run build && git push
```

### 5. Clear Commit Messages
```
# Format: <type>(<scope>): <subject>
feat(strava): implement OAuth token refresh
fix(strava-service): handle expired tokens gracefully
test(strava): add activity sync integration tests
docs(strava): update setup guide with env vars
chore(strava): remove debug console.logs
```

## Rollback / Undo Scenarios

### Undo Unpushed Commits
```bash
git reset --soft HEAD~1    # Keep changes, undo commit
git reset --hard HEAD~1    # Discard changes entirely
```

### Undo Pushed Commits
```bash
# Revert specific commit (creates new "undo" commit)
git revert <commit-hash>
git push origin feature/strava-<component>

# OR reset and force-push (only if not shared)
git reset --hard HEAD~1
git push --force-with-lease origin feature/strava-<component>
```

### Abandon Feature Branch
```bash
git checkout main
git branch -D feature/strava-<component>
git push origin --delete feature/strava-<component>
```

## Pull Request Template (GitHub)

Create `.github/pull_request_template.md`:

```markdown
## 📝 Description
Brief description of changes

## 🔗 Related To
Links to:
- Migration plan: STRAVA_MIGRATION_PLAN.md (Phase X)
- Related issues/tickets

## ✅ Checklist
- [ ] Tests pass (`npm run test`)
- [ ] Linting passes (`npm run lint`)
- [ ] TypeScript strict mode passes
- [ ] A11y compliance verified
- [ ] Docs updated if needed
- [ ] Performance impact assessed

## 🧪 Testing
How to test these changes:
1. ...
2. ...
3. ...

## 📸 Screenshots/Demo
If UI changes, include screenshots or demo instructions

## 🚨 Breaking Changes
None / Describe if applicable
```

## Useful Commands Reference

```bash
# Status
git status
git branch -a
git log --oneline -10

# Fetching updates
git fetch origin
git pull origin main

# Rebasing workflow
git rebase origin/main
git rebase -i HEAD~5        # Interactive rebase last 5 commits

# Branch management
git branch -D <branch>      # Delete local
git push origin --delete <branch>  # Delete remote
git branch -m <old> <new>   # Rename

# Cleaning up
git gc                       # Garbage collect
git remote prune origin      # Clean up stale remote branches

# Viewing changes
git diff origin/main...HEAD  # Changes not yet in main
git log origin/main..HEAD    # Commits not yet in main
git show <commit>            # View specific commit
```

## Monitoring Branch Health

### Quick Health Check
```bash
git fetch origin

# See commits ahead/behind main
git rev-list --left-right --count origin/main...HEAD

# See conflicting changes if rebasing later
git merge-base --is-ancestor origin/main HEAD
```

### Before Merge Request
```bash
# Ensure your branch is up to date
git rebase origin/main

# Check for new conflicts
git diff --name-only --diff-filter=U

# Verify all tests pass
npm run lint && npm run test && npm run build
```

## Summary

**Key Principles:**
1. ✅ Rebase frequently to avoid conflicts
2. ✅ Keep branches short-lived (<2 weeks)
3. ✅ Commit often with clear messages
4. ✅ Test before pushing
5. ✅ Use `--force-with-lease` (never `--force`)
6. ✅ Squash/rebase merge for clean history
7. ✅ Delete merged branches promptly

**Phase Sequencing:**
- Setup → Types → Service → Auth & Components (parallel) → Testing → Docs

**Team Coordination:**
- Communicate via issues/PR comments
- Rebase together if working in overlapping areas
- Review PRs promptly to unblock subsequent phases
