# Project Automation Setup Guide

> **Reusable guide for implementing security checks, semantic versioning, and CI/CD automation in any GitHub project**

This guide documents the complete automation setup including security scanning, conventional commits, semantic versioning, and GitHub Actions CI/CD. You can apply this to any of your GitHub projects.

---

## Table of Contents

1. [Security Automation](#security-automation)
2. [Semantic Versioning & Releases](#semantic-versioning--releases)
3. [GitHub Actions CI/CD](#github-actions-cicd)
4. [VS Code Integration](#vs-code-integration)
5. [Quick Setup Checklist](#quick-setup-checklist)

---

## Security Automation

### 1. NPM Security Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "security:scan": "git diff --cached | grep -E \"(password|secret|api_key|private_key|token|credential).*=.*['\\\"]\" || echo '✅ No secrets found in staged files'",
    "security:console": "git grep -n \"console\\.log\" src/ || echo '✅ No console.log found'",
    "security:audit": "npm audit",
    "security:check": "npm run security:scan && npm run security:console && npm run security:audit",
    "precommit": "npm run security:check"
  }
}
```

**What each script does:**

- `security:scan` - Scans staged files for hardcoded secrets
- `security:console` - Finds console.log statements in source code
- `security:audit` - Runs npm audit to check for vulnerable dependencies
- `security:check` - Runs all security checks in one command
- `precommit` - Optional pre-commit hook runner

### 2. Shell Scripts (Optional)

Create `scripts/security-check.sh` (Linux/macOS):

```bash
#!/bin/bash
# Security Check Script
# Run this before committing code

echo "🔒 Running Security Checks..."
echo "================================"
echo ""

# Check 1: Scan for secrets in staged files
echo "🔍 Checking for secrets in staged files..."
if git diff --cached | grep -E "(password|secret|api_key|private_key|token|credential).*=.*['\"]"; then
    echo "❌ FAIL: Potential secrets found in staged files!"
    exit 1
else
    echo "✅ PASS: No secrets found"
fi
echo ""

# Check 2: Find console.log statements
echo "🐛 Checking for console.log statements..."
if git grep -n "console\.log" src/; then
    echo "⚠️  WARNING: console.log statements found"
    echo "   Consider removing these before production"
else
    echo "✅ PASS: No console.log found"
fi
echo ""

# Check 3: Check for .env files in staging
echo "📁 Checking for .env files in staging..."
if git diff --cached --name-only | grep -E "\.env$|\.env\.local$|\.env\.production$"; then
    echo "❌ FAIL: .env file in staged changes!"
    exit 1
else
    echo "✅ PASS: No .env files staged"
fi
echo ""

# Check 4: NPM Audit
echo "🛡️  Running npm audit..."
if npm audit --audit-level=moderate; then
    echo "✅ PASS: No vulnerabilities found"
else
    echo "⚠️  WARNING: Vulnerabilities detected"
    echo "   Run 'npm audit fix' to resolve"
fi
echo ""

echo "================================"
echo "✅ Security checks complete!"
```

Create `scripts/security-check.bat` (Windows):

```batch
@echo off
REM Security Check Script (Windows)
REM Run this before committing code

echo 🔒 Running Security Checks...
echo ================================
echo.

REM Check 1: NPM security scripts
echo 🔍 Checking for secrets...
call npm run security:scan
if %ERRORLEVEL% NEQ 0 (
    echo ❌ FAIL: Potential secrets found!
    exit /b 1
)
echo.

REM Check 2: Console.log check
echo 🐛 Checking for console.log statements...
call npm run security:console
echo.

REM Check 3: NPM Audit
echo 🛡️  Running npm audit...
call npm run security:audit
echo.

echo ================================
echo ✅ Security checks complete!
echo.
echo Safe to commit? Review any warnings above.
```

Make the scripts executable (Linux/macOS):

```bash
chmod +x scripts/security-check.sh
```

---

## Semantic Versioning & Releases

### 1. Install Dependencies

```bash
npm install --save-dev \
  semantic-release \
  @semantic-release/changelog \
  @semantic-release/git \
  @commitlint/cli \
  @commitlint/config-conventional
```

### 2. Commitlint Configuration

Create `commitlint.config.js`:

```javascript
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // New feature
        "fix", // Bug fix
        "docs", // Documentation changes
        "style", // Code style changes (formatting, etc.)
        "refactor", // Code refactoring
        "perf", // Performance improvements
        "test", // Adding or updating tests
        "build", // Build system changes
        "ci", // CI configuration changes
        "chore", // Other changes (maintenance, etc.)
        "revert", // Revert a previous commit
      ],
    ],
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],
    "scope-case": [2, "always", "lower-case"],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "header-max-length": [2, "always", 100],
    "body-leading-blank": [1, "always"],
    "body-max-line-length": [2, "always", 100],
    "footer-leading-blank": [1, "always"],
    "footer-max-line-length": [2, "always", 100],
  },
};
```

### 3. Semantic Release Configuration

Create `.releaserc.json`:

```json
{
  "branches": ["main"],
  "plugins": [
    [
      "@semantic-release/commit-analyzer",
      {
        "preset": "conventionalcommits",
        "releaseRules": [
          { "type": "feat", "release": "minor" },
          { "type": "fix", "release": "patch" },
          { "type": "perf", "release": "patch" },
          { "type": "revert", "release": "patch" },
          { "type": "docs", "release": false },
          { "type": "style", "release": false },
          { "type": "refactor", "release": "patch" },
          { "type": "test", "release": false },
          { "type": "build", "release": false },
          { "type": "ci", "release": false },
          { "type": "chore", "release": false },
          { "breaking": true, "release": "major" }
        ]
      }
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        "preset": "conventionalcommits",
        "presetConfig": {
          "types": [
            { "type": "feat", "section": "✨ Features" },
            { "type": "fix", "section": "🐛 Bug Fixes" },
            { "type": "perf", "section": "⚡ Performance Improvements" },
            { "type": "revert", "section": "⏪ Reverts" },
            { "type": "refactor", "section": "♻️ Code Refactoring" },
            { "type": "docs", "section": "📚 Documentation", "hidden": false },
            { "type": "style", "section": "💎 Styles", "hidden": true },
            {
              "type": "chore",
              "section": "🔧 Miscellaneous Chores",
              "hidden": true
            },
            { "type": "test", "section": "✅ Tests", "hidden": true },
            { "type": "build", "section": "🏗️ Build System", "hidden": true },
            { "type": "ci", "section": "👷 CI", "hidden": true }
          ]
        }
      }
    ],
    [
      "@semantic-release/changelog",
      {
        "changelogFile": "CHANGELOG.md",
        "changelogTitle": "# Project Changelog\n\nAll notable changes to this project will be documented in this file."
      }
    ],
    [
      "@semantic-release/npm",
      {
        "npmPublish": false
      }
    ],
    [
      "@semantic-release/git",
      {
        "assets": ["CHANGELOG.md", "package.json"],
        "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ],
    [
      "@semantic-release/github",
      {
        "successComment": "🎉 This issue has been resolved in version ${nextRelease.version} 🎉\n\nThe release is available on [GitHub Releases](${releases[0].url})",
        "labels": ["released"],
        "releasedLabels": ["released"]
      }
    ]
  ]
}
```

### 4. Add NPM Script

Add to `package.json`:

```json
{
  "scripts": {
    "semantic-release": "semantic-release"
  }
}
```

### 5. Commit Message Format

Use conventional commits for all commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Examples:**

```
feat(auth): add user login functionality
fix(api): resolve timeout issue with large datasets
docs(readme): update installation instructions
chore(deps): upgrade react to v19
```

**Breaking changes:**

```
feat(api)!: change authentication method

BREAKING CHANGE: The authentication now uses JWT tokens instead of session cookies.
```

---

## GitHub Actions CI/CD

### 1. CI Pipeline

Create `.github/workflows/ci.yml`:

```yaml
name: CI Pipeline

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  lint:
    name: Lint Code
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

  test:
    name: Run Tests
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run Tests
        run: npm test

      - name: Generate Coverage
        run: npm run test:coverage
        continue-on-error: true

  security:
    name: Security Checks
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Check for console.log
        run: npm run security:console

      - name: Run npm audit
        run: npm run security:audit
        continue-on-error: true

  build:
    name: Build Validation
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build
```

### 2. Release Pipeline

Create `.github/workflows/release.yml`:

```yaml
name: Release

on:
  push:
    branches:
      - main

permissions:
  contents: write
  issues: write
  pull-requests: write

jobs:
  release:
    name: Semantic Release
    runs-on: ubuntu-latest
    if: "!contains(github.event.head_commit.message, 'skip ci')"
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          persist-credentials: false

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Verify Build
        run: npm run build

      - name: Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: npm run semantic-release
```

### 3. GitHub Permissions

The release workflow requires specific permissions. Make sure:

1. **Repository Settings** → **Actions** → **General**
2. Under "Workflow permissions", select:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**

---

## VS Code Integration

### 1. Recommended Extensions

Create `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "GitHub.copilot",
    "GitHub.copilot-chat",
    "foxundermoon.shell-format",
    "timonwong.shellcheck"
  ]
}
```

### 2. VS Code Tasks

Create `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "🔒 Security: Full Check",
      "type": "shell",
      "command": "npm run security:check",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      },
      "group": {
        "kind": "test",
        "isDefault": false
      }
    },
    {
      "label": "🔍 Security: Scan for Secrets",
      "type": "shell",
      "command": "npm run security:scan",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "🐛 Security: Find Console Logs",
      "type": "shell",
      "command": "npm run security:console",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "🛡️ Security: NPM Audit",
      "type": "shell",
      "command": "npm run security:audit",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "✅ Pre-Commit Check",
      "type": "shell",
      "command": "npm run precommit",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    }
  ]
}
```

**Running tasks:**

- Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS)
- Type "Tasks: Run Task"
- Select the security task you want to run

---

## Quick Setup Checklist

Use this checklist when setting up a new project:

### Phase 1: Security Setup

- [ ] Add security scripts to `package.json`
- [ ] Create `scripts/security-check.sh` (optional)
- [ ] Create `scripts/security-check.bat` (optional)
- [ ] Make shell scripts executable: `chmod +x scripts/*.sh`
- [ ] Test security checks: `npm run security:check`

### Phase 2: Semantic Versioning

- [ ] Install dependencies:
  ```bash
  npm install --save-dev semantic-release @semantic-release/changelog @semantic-release/git @commitlint/cli @commitlint/config-conventional
  ```
- [ ] Create `commitlint.config.js`
- [ ] Create `.releaserc.json`
- [ ] Add `semantic-release` script to `package.json`
- [ ] Test commitlint: Make a commit with wrong format and verify it's caught

### Phase 3: GitHub Actions

- [ ] Create `.github/workflows/ci.yml`
- [ ] Create `.github/workflows/release.yml`
- [ ] Configure GitHub repository permissions for Actions
- [ ] Push to GitHub and verify workflows run

### Phase 4: VS Code Integration

- [ ] Create `.vscode/extensions.json`
- [ ] Create `.vscode/tasks.json`
- [ ] Install recommended extensions
- [ ] Test running tasks from VS Code

### Phase 5: Verification

- [ ] Make a test commit using conventional format
- [ ] Verify CI pipeline runs successfully
- [ ] Verify release is created automatically
- [ ] Check CHANGELOG.md is generated
- [ ] Verify version bump in package.json

---

## Usage Examples

### Daily Development

**Before committing:**

```bash
npm run security:check
```

**Making a commit:**

```bash
git add .
git commit -m "feat(auth): add password reset functionality"
```

**Force a specific version bump:**

```bash
# Minor version bump
git commit -m "feat: add new feature"

# Patch version bump
git commit -m "fix: resolve bug"

# Major version bump (breaking change)
git commit -m "feat!: redesign API

BREAKING CHANGE: API endpoints have changed"
```

**Skip CI for documentation changes:**

```bash
git commit -m "docs: update readme [skip ci]"
```

### Troubleshooting

**If semantic-release doesn't create a release:**

1. Check commit messages follow conventional format
2. Verify GitHub token has write permissions
3. Check workflow permissions in repository settings
4. Review the GitHub Actions logs

**If security checks fail:**

- Review the error messages
- Remove any hardcoded secrets
- Remove console.log statements
- Run `npm audit fix` for vulnerabilities

---

## Customization Tips

### Adjust Security Patterns

Modify the regex patterns in `security:scan` to match your needs:

```json
"security:scan": "git diff --cached | grep -E \"(YOUR_PATTERN_HERE)\" || echo '✅ No issues found'"
```

### Custom Release Rules

Modify `.releaserc.json` to change when releases are triggered:

```json
"releaseRules": [
  { "type": "feat", "release": "minor" },
  { "type": "fix", "release": "patch" },
  { "type": "docs", "release": "patch" }  // Release on doc changes
]
```

### Project-Specific Source Paths

Update the source path in `security:console` for your project structure:

```json
"security:console": "git grep -n \"console\\.log\" src/ lib/ components/ || echo '✅ No console.log found'"
```

---

## Benefits

✅ **Security**: Automated scanning for secrets and vulnerabilities  
✅ **Consistency**: Enforced commit message format  
✅ **Automation**: Automatic version bumping and release notes  
✅ **Traceability**: Clear changelog and release history  
✅ **CI/CD**: Automated testing and validation  
✅ **Developer Experience**: VS Code tasks for quick access

---

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Release](https://semantic-release.gitbook.io/)
- [Commitlint](https://commitlint.js.org/)
- [GitHub Actions](https://docs.github.com/en/actions)

---

## License

This guide is free to use and modify for any project.

---

**Last Updated**: May 2026  
**Compatible With**: Node.js 18+, npm 9+, GitHub Actions
