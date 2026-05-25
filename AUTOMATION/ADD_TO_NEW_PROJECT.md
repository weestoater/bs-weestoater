# Add Automation to New Project

> **Quick guide: Copy files and run commands to add automation to any project**

---

## 📋 Step-by-Step Instructions

### Step 1: Copy Files & Folders

Copy these files/folders from this project to your new project:

```
Source (WeeGym) → Destination (New Project)
==============================================

📁 .github/workflows/         → .github/workflows/
   ├── ci.yml                → ci.yml
   └── release.yml           → release.yml

📁 .vscode/                   → .vscode/
   ├── tasks.json            → tasks.json
   └── extensions.json       → extensions.json

📁 scripts/                   → scripts/
   ├── security-check.sh     → security-check.sh
   └── security-check.bat    → security-check.bat

📄 .releaserc.json           → .releaserc.json
📄 commitlint.config.js      → commitlint.config.js
```

### Step 2: Make Scripts Executable (Linux/macOS Only)

```bash
chmod +x scripts/security-check.sh
```

### Step 3: Install NPM Dependencies

```bash
npm install --save-dev \
  semantic-release \
  @semantic-release/changelog \
  @semantic-release/git \
  @commitlint/cli \
  @commitlint/config-conventional
```

### Step 4: Add Scripts to package.json

**Option A: Use AI/Copilot Prompt**

```
Add these scripts to package.json:
- security:scan - check for hardcoded secrets in staged files
- security:console - find console.log statements in src/
- security:audit - run npm audit
- security:check - run all security checks
- precommit - run security:check
- semantic-release - run semantic-release

Use the exact scripts from PROJECT_AUTOMATION_TEMPLATE.md
```

**Option B: Manually Add**

Open `package.json` and add to the `scripts` section:

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

### Step 5: Customize for Your Project

**Update .releaserc.json:**

- Change `changelogTitle` to match your project name
- Adjust branch name if not using `main`

**Update security:console script if needed:**

- Change `src/` to match your source folder (e.g., `lib/`, `app/`, etc.)

**Update GitHub workflows if needed:**

- Change Node version if you use a different version
- Update build commands to match your project
- Add environment variables if needed

### Step 6: Configure GitHub Repository

1. Go to **Settings → Actions → General**
2. Under **Workflow permissions**:
   - ✅ Select "Read and write permissions"
   - ✅ Enable "Allow GitHub Actions to create and approve pull requests"
3. Click **Save**

### Step 7: Test Everything

```bash
# Test security checks
npm run security:check

# Test commitlint (should fail with bad format)
git add .
git commit -m "bad commit message"
# Should fail ❌

# Test commitlint (should succeed)
git commit -m "feat: add automation setup"
# Should pass ✅

# Push to GitHub and verify workflows run
git push origin main
```

---

## 🤖 AI Assistant Prompts

Use these prompts with GitHub Copilot or any AI assistant:

### Prompt 1: Copy Configuration Files

```
Copy the automation setup from the WeeGym project to this new project:
1. Copy .github/workflows/ folder (ci.yml and release.yml)
2. Copy .vscode/ folder (tasks.json and extensions.json)
3. Copy scripts/ folder (security check scripts)
4. Copy .releaserc.json and commitlint.config.js
5. Update project name in .releaserc.json to match this project
```

### Prompt 2: Add NPM Scripts

```
Add the following npm scripts to package.json:
- security:scan: check for secrets in staged git files
- security:console: find console.log in source code
- security:audit: run npm audit
- security:check: run all three security checks
- precommit: run security:check
- semantic-release: run semantic-release

Use the exact implementations from docs/PROJECT_AUTOMATION_TEMPLATE.md
```

### Prompt 3: Install Dependencies

```
Install these dev dependencies:
- semantic-release
- @semantic-release/changelog
- @semantic-release/git
- @commitlint/cli
- @commitlint/config-conventional

Run npm install with --save-dev flag
```

### Prompt 4: Customize for Project

```
Update the automation config for this project:
1. In .releaserc.json, change "WeeGym" to "[YOUR_PROJECT_NAME]"
2. In package.json security:console script, update "src/" to match our source folder
3. In .github/workflows/*.yml, verify the build commands match our project
4. Add any required environment variables to the workflows
```

### Prompt 5: Setup Verification

```
Help me verify the automation setup:
1. Run npm run security:check and show results
2. Try a test commit with format: "test: verify commitlint"
3. List all GitHub workflow files
4. Check if scripts are executable (Linux/macOS)
5. Verify .releaserc.json has correct project name
```

---

## 📁 File Checklist

After copying, your new project should have:

```
your-new-project/
├── .github/
│   └── workflows/
│       ├── ci.yml              ✅
│       └── release.yml         ✅
├── .vscode/
│   ├── tasks.json              ✅
│   └── extensions.json         ✅
├── scripts/
│   ├── security-check.sh       ✅
│   └── security-check.bat      ✅
├── .releaserc.json             ✅
├── commitlint.config.js        ✅
└── package.json                ✅ (updated with scripts)
```

---

## ✅ Verification Checklist

Run through this checklist to ensure everything works:

- [ ] **Files copied**: All 8 files/folders are in place
- [ ] **Dependencies installed**: `npm list semantic-release` shows installed
- [ ] **Scripts added**: `npm run security:check` works
- [ ] **Scripts executable**: `./scripts/security-check.sh` runs (Linux/macOS)
- [ ] **Commitlint works**: Bad commit format is rejected
- [ ] **GitHub permissions**: Repository Actions settings updated
- [ ] **CI workflow runs**: Push to GitHub triggers ci.yml
- [ ] **Release workflow runs**: Merge to main triggers release.yml
- [ ] **VS Code tasks work**: Run task from Command Palette
- [ ] **Customized**: Project name updated in .releaserc.json

---

## 🎯 Quick Copy Commands (Linux/macOS/Git Bash)

If you have both projects locally:

```bash
# Set source and destination
SOURCE="/path/to/weegym"
DEST="/path/to/new-project"

# Copy all files at once
cp -r "$SOURCE/.github" "$DEST/"
cp -r "$SOURCE/.vscode" "$DEST/"
cp -r "$SOURCE/scripts" "$DEST/"
cp "$SOURCE/.releaserc.json" "$DEST/"
cp "$SOURCE/commitlint.config.js" "$DEST/"

# Make scripts executable
chmod +x "$DEST/scripts"/*.sh

# Navigate to new project
cd "$DEST"

# Install dependencies
npm install --save-dev \
  semantic-release \
  @semantic-release/changelog \
  @semantic-release/git \
  @commitlint/cli \
  @commitlint/config-conventional

echo "✅ Files copied! Now add scripts to package.json"
```

## 🎯 Quick Copy Commands (Windows PowerShell)

```powershell
# Set source and destination
$SOURCE = "D:\git\aws\weegym"
$DEST = "D:\path\to\new-project"

# Copy all files at once
Copy-Item "$SOURCE\.github" -Destination "$DEST\" -Recurse -Force
Copy-Item "$SOURCE\.vscode" -Destination "$DEST\" -Recurse -Force
Copy-Item "$SOURCE\scripts" -Destination "$DEST\" -Recurse -Force
Copy-Item "$SOURCE\.releaserc.json" -Destination "$DEST\"
Copy-Item "$SOURCE\commitlint.config.js" -Destination "$DEST\"

# Navigate to new project
cd "$DEST"

# Install dependencies
npm install --save-dev semantic-release @semantic-release/changelog @semantic-release/git @commitlint/cli @commitlint/config-conventional

Write-Host "✅ Files copied! Now add scripts to package.json"
```

---

## 🔧 Customization Requirements

### Required Changes

1. **Update project name** in `.releaserc.json` (changelogTitle)
2. **Verify source folder** in `package.json` security:console script
3. **Update Node version** in workflows if different from v20

### Optional Changes

1. **Branch name**: Change from "main" if you use different default branch
2. **Build command**: Update in workflows if not `npm run build`
3. **Test command**: Update in workflows if not `npm test`
4. **Security patterns**: Add custom patterns to security:scan regex
5. **Release rules**: Modify when versions bump in .releaserc.json

---

## 🚀 First Commit After Setup

```bash
# Add all new files
git add .github/ .vscode/ scripts/ .releaserc.json commitlint.config.js package.json

# Make your first conventional commit
git commit -m "chore(automation): add CI/CD and semantic release

- Add GitHub Actions workflows for CI and releases
- Add security scanning scripts
- Add semantic-release configuration
- Add VS Code tasks and extensions
- Configure commitlint for conventional commits"

# Push to GitHub
git push origin main

# Watch your workflows run! 🎉
# Check: https://github.com/YOUR-USERNAME/YOUR-REPO/actions
```

---

## 📚 Reference Files

For detailed information, see:

- **[PROJECT_AUTOMATION_SETUP_GUIDE.md](PROJECT_AUTOMATION_SETUP_GUIDE.md)** - Full guide with explanations
- **[PROJECT_AUTOMATION_TEMPLATE.md](PROJECT_AUTOMATION_TEMPLATE.md)** - All config file templates

---

## 💡 Pro Tips

1. **Test locally first**: Run `npm run security:check` before pushing
2. **Watch first release**: The first push to main will trigger a release
3. **Use VS Code tasks**: Press `Ctrl+Shift+P` → "Tasks: Run Task" → Select security check
4. **Skip CI when needed**: Add `[skip ci]` to commit message for docs
5. **Check workflow logs**: GitHub Actions tab shows detailed logs

---

**Setup Time**: ~10 minutes  
**Automation Value**: Infinite 🚀
