# GitHub Actions Configuration

This repository uses a centralized approach to manage Node.js versions across all GitHub Actions workflows.

## 🎯 Centralized Configuration

### Primary Configuration Files:

1. **`.nvmrc`** - Contains the primary Node.js version used across the project
2. **`.github/actions/setup-node/action.yml`** - Composite action for consistent Node.js setup
3. **`.github/config.yml`** - Additional workflow configuration values
4. **`package.json` engines** - Node.js version requirements

## 🔧 How It Works

### Node.js Version Management:

- **Primary version**: Defined in `.nvmrc` (currently: `20`)
- **Automatic detection**: Workflows automatically read from `.nvmrc`
- **Fallback**: If `.nvmrc` is missing, defaults to `20.x`
- **Multiple versions**: CI tests against both `18.x` and `20.x` for compatibility

### Composite Action Benefits:

- **Consistency**: All workflows use the same Node.js setup process
- **DRY Principle**: No duplication of setup steps
- **Easy updates**: Change Node.js version in one place (`.nvmrc`)
- **Enhanced logging**: Shows which version is being used and why

## 📝 Usage in Workflows

Instead of:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: "20.x"
    cache: "yarn"
```

Use:

```yaml
- name: Setup Node.js
  uses: ./.github/actions/setup-node
```

Or with a specific version:

```yaml
- name: Setup Node.js
  uses: ./.github/actions/setup-node
  with:
    node-version: "18.x"
```

## 🔄 Updating Node.js Version

To update the Node.js version used across all workflows:

1. **Update `.nvmrc`**:

   ```bash
   echo "22" > .nvmrc
   ```

2. **Update `package.json` engines** (if needed):

   ```json
   {
     "engines": {
       "node": ">=22.0.0"
     }
   }
   ```

3. **Commit and push** - all workflows will automatically use the new version

## 📊 Current Configuration

- **Primary Node.js version**: `20.x` (from `.nvmrc`)
- **CI test matrix**: `['18.x', '20.x']`
- **Minimum required**: `>=18.0.0` (from `package.json`)
- **Package manager**: Yarn with caching enabled

## 🚀 Workflows Using This Setup

- **CI Workflow** (`ci.yml`) - Tests on multiple Node.js versions
- **Code Quality** (`code-quality.yml`) - Uses primary version
- **Deploy** (`deploy.yml`) - Uses primary version
- **Health Check** (`health-check.yml`) - Uses system default

## 🎯 Benefits

1. **Single Source of Truth**: Change Node.js version in one place
2. **Consistency**: All workflows use the same setup process
3. **Flexibility**: Can override version when needed
4. **Maintainability**: Easy to update and maintain
5. **Transparency**: Clear logging of which version is being used
