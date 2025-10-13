# GitHub Actions Workflows

This repository uses automated workflows for continuous integration, code quality, and deployment.

## í´„ Active Workflows

### 1. **CI** (`ci.yml`)
**Triggers:** Push to main, Pull requests
**Purpose:** Main testing and building pipeline

- âœ… Lint code (non-blocking - shows warnings but doesn't fail)
- âœ… Run unit tests with coverage (non-blocking)
- âœ… Build project
- âœ… Upload build artifacts and coverage reports

### 2. **Code Quality** (`code-quality.yml`)
**Triggers:** Push to main, Pull requests, Weekly schedule
**Purpose:** Security and dependency monitoring

- í´’ Security audit with yarn audit
- ï¿½ï¿½ Dependency review for pull requests
- í³… Weekly scheduled security checks

### 3. **Deploy** (`deploy.yml`)
**Triggers:** After successful CI, Manual dispatch
**Purpose:** Automated deployment to GitHub Pages

- âš¡ Only runs after CI passes
- íº€ Deploys to GitHub Pages
- í¾¯ Can be triggered manually

## âš™ï¸ Configuration

### Node.js Version
- **Standard Version:** 20.x (defined in `.nvmrc`)
- **Centralized:** All workflows use `NODE_VERSION: '20.x'`

### Package Manager
- **Primary:** Yarn with frozen lockfile
- **Caching:** Enabled for faster builds

## í¾¯ Workflow Features

### Resilient Testing
- Tests and linting are **non-blocking** (show warnings but don't fail CI)
- Build must succeed for deployment
- Coverage reports always uploaded

### Smart Deployment
- Only deploys when CI passes
- Manual deployment option available
- Proper GitHub Pages permissions

### Security Monitoring
- Weekly security audits
- Dependency vulnerability checks
- Automated dependency review on PRs

## í³Š Status

All workflows are **production-ready** and should run successfully on every commit.

## ï¿½ï¿½ Updating Node.js Version

To update the Node.js version across all workflows:

1. Update `.nvmrc` file: `echo "22" > .nvmrc`
2. Update `package.json` engines if needed
3. All workflows will automatically use the new version

## í³ˆ Artifacts

- **Build files** (7 days retention)
- **Coverage reports** (7 days retention)  
- **Playwright reports** (7 days retention, on failure)
