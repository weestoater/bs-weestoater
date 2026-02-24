# GitHub Actions Workflows

**Status:** ⚠️ All workflows are currently **DISABLED**

This repository previously used automated workflows for continuous integration, code quality, and deployment, but they have been disabled.

## 📁 Files

- `deploy.yml.disabled` - Disabled deployment workflow (inactive)

## 🔧 To Re-enable (if needed)

If you want to re-enable GitHub Actions in the future:

1. Create workflow files in `.github/workflows/` directory
2. Standard workflow patterns available in Git history
3. Remember to configure any necessary secrets in GitHub repository settings

## 📝 Previous Configuration

Previously configured workflows included:

- CI testing and building
- Code quality and security audits
- Automated deployment to GitHub Pages

All workflows have been removed to prevent automatic execution on commits.

- Manual deployment option available
- Proper GitHub Pages permissions

### Security Monitoring

- Weekly security audits
- Dependency vulnerability checks
- Automated dependency review on PRs

## ��� Status

All workflows are **production-ready** and should run successfully on every commit.

## �� Updating Node.js Version

To update the Node.js version across all workflows:

1. Update `.nvmrc` file: `echo "22" > .nvmrc`
2. Update `package.json` engines if needed
3. All workflows will automatically use the new version

## ��� Artifacts

- **Build files** (7 days retention)
- **Coverage reports** (7 days retention)
- **Playwright reports** (7 days retention, on failure)
