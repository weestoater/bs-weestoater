# Project Automation Quick Template

> **Copy-paste templates for rapid project setup**

## 📦 package.json Scripts

```json
{
  "scripts": {
    "security:scan": "git diff --cached | grep -E \"(password|secret|api_key|private_key|token|credential).*=.*['\\\"]\" || echo '✅ No secrets found in staged files'",
    "security:console": "git grep -n \"console\\.log\" src/ || echo '✅ No console.log found'",
    "security:audit": "npm audit",
    "security:check": "npm run security:scan && npm run security:console && npm run security:audit",
    "precommit": "npm run security:check",
    "semantic-release": "semantic-release"
  }
}
```

## 📦 Install Commands

```bash
# Semantic Release & Commitlint
npm install --save-dev \
  semantic-release \
  @semantic-release/changelog \
  @semantic-release/git \
  @commitlint/cli \
  @commitlint/config-conventional
```

## 📄 commitlint.config.js

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
        "style", // Code style changes
        "refactor", // Code refactoring
        "perf", // Performance improvements
        "test", // Adding or updating tests
        "build", // Build system changes
        "ci", // CI configuration changes
        "chore", // Other changes
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

## 📄 .releaserc.json

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
            { "type": "docs", "section": "📚 Documentation", "hidden": false }
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

## 📄 .github/workflows/ci.yml

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

## 📄 .github/workflows/release.yml

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

## 📄 .vscode/extensions.json

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

## 📄 .vscode/tasks.json

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
      "problemMatcher": []
    },
    {
      "label": "🐛 Security: Find Console Logs",
      "type": "shell",
      "command": "npm run security:console",
      "problemMatcher": []
    },
    {
      "label": "🛡️ Security: NPM Audit",
      "type": "shell",
      "command": "npm run security:audit",
      "problemMatcher": []
    },
    {
      "label": "✅ Pre-Commit Check",
      "type": "shell",
      "command": "npm run precommit",
      "problemMatcher": []
    }
  ]
}
```

## 🔧 Setup Commands

```bash
# Create directory structure
mkdir -p .github/workflows .vscode scripts

# Install dependencies
npm install --save-dev semantic-release @semantic-release/changelog @semantic-release/git @commitlint/cli @commitlint/config-conventional

# Make scripts executable (Linux/macOS)
chmod +x scripts/*.sh

# Configure GitHub repository settings
# Go to Settings → Actions → General
# Set "Workflow permissions" to "Read and write permissions"
# Enable "Allow GitHub Actions to create and approve pull requests"
```

## 🚀 Usage

```bash
# Run security checks
npm run security:check

# Make a commit (conventional format)
git commit -m "feat(auth): add login functionality"
git commit -m "fix(api): resolve timeout issue"
git commit -m "docs: update readme"

# Breaking changes
git commit -m "feat!: redesign API

BREAKING CHANGE: API endpoints have changed"

# Skip CI
git commit -m "docs: update readme [skip ci]"
```

## ✅ Verification Checklist

- [ ] Security scripts run without errors
- [ ] Commitlint rejects invalid commit messages
- [ ] CI workflow runs on push/PR
- [ ] Release workflow creates new versions
- [ ] CHANGELOG.md is auto-generated
- [ ] VS Code tasks work correctly
- [ ] GitHub releases are created automatically
