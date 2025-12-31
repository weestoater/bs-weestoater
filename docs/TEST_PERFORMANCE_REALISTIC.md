# Test Performance Optimization - Summary

## Performance Analysis

### Test Execution Breakdown

From the test output, the main time consumers are:

```
Total Duration: ~70-75s
├─ Environment setup: ~200s (multiple test files × setup time)
├─ Import/Module loading: ~150s
├─ Setup (beforeEach, etc): ~70s
├─ Transform (TypeScript, JSX): ~5-7s
└─ Actual test execution: ~18-20s
```

**Key Insight**: Only ~25% of time is actual test execution. The rest is overhead from:

- Creating jsdom environments (200s total across all test files)
- Loading and transforming modules (150s)
- Running setup hooks (70s)

## Optimizations Implemented

### 1. **Global Browser API Mocks** (setupTest.ts)

Added global mocks to avoid repetitive mocking in individual test files:

```typescript
// IntersectionObserver (used by lazy loading)
global.IntersectionObserver = vi.fn().mockImplementation(...)

// matchMedia (used by responsive components)
Object.defineProperty(window, "matchMedia", ...)
```

**Benefit**: Cleaner test files, slight reduction in setup time

### 2. **Optimized Pool Configuration** (vite.config.ts)

```typescript
pool: "forks", // More stable on Windows
maxConcurrency: 4, // Limit concurrent tests
```

**Why not threads with `isolate: false`?**

- Causes "EMFILE: too many open files" on Windows
- @phosphor-icons has 1000+ icon files
- Windows has lower file handle limits than Linux/Mac

### 3. **New Test Commands** (package.json)

- `yarn test:watch` - Watch mode for development
- `yarn test:ui` - Visual test runner
- `yarn test:changed` - Only run tests for changed files

## Realistic Expectations

**The Hard Truth**: Major improvements are limited because:

1. **Environment creation is expensive** (~200s total)

   - jsdom environment creation per test file
   - React component rendering overhead
   - Limited by Vitest architecture

2. **Module imports are heavy** (~150s)

   - ag-grid, ag-charts are large libraries
   - Bootstrap, React Router, etc.
   - Can't easily reduce without mocking everything

3. **Setup time includes React renders** (~70s)
   - Real DOM operations in jsdom
   - Component lifecycle hooks
   - Cannot skip without sacrificing test quality

## Practical Speedup Strategies

### 1. **Selective Test Execution** ⭐ **Best ROI**

Run only what you're working on:

```bash
# Single file (runs in ~2-3s)
yarn test src/__tests__/components/ErrorBoundary.test.tsx

# Specific directory
yarn test src/__tests__/components

# Changed files only
yarn test:changed
```

### 2. **Use Vitest UI During Development**

```bash
yarn test:ui
```

Benefits:

- Faster feedback loop
- Visual test runner
- Selective test execution
- Better debugging

### 3. **Parallel CI Execution**

For CI/CD, shard tests across multiple jobs:

```yaml
# .github/workflows/test.yml
strategy:
  matrix:
    shard: [1/4, 2/4, 3/4, 4/4]
steps:
  - run: yarn test --shard=${{ matrix.shard }}
```

### 4. **Mock Heavy Dependencies**

For components using ag-grid/ag-charts, mock them:

```typescript
vi.mock("ag-charts-react", () => ({
  AgCharts: () => <div data-testid="ag-charts">Mocked</div>,
}));
```

**Already done** in most tests like slimmingWorld.test.tsx

### 5. **Reduce Test Scope**

Ask yourself:

- Do I need to render the full component?
- Can I test the logic separately from the UI?
- Are there redundant tests?

## Why Tests Feel Slow

**Unit Tests**: 252 tests in ~70s = **3.6 tests/second**

This seems slow, but consider:

- Each test renders React components
- jsdom simulates a real browser
- Full component lifecycle runs
- Event handlers fire
- State updates trigger re-renders

**Comparison**:

- Pure logic tests: 100+ tests/second
- Component tests (jsdom): 3-10 tests/second ← **You are here**
- Real browser E2E tests: 0.5-2 tests/second

You're already in a good range for React component tests!

## What NOT to Do

❌ **Don't** use `isolate: false` on Windows  
→ Causes file handle exhaustion

❌ **Don't** mock everything  
→ Defeats the purpose of integration tests

❌ **Don't** skip important tests for speed  
→ Bugs in production cost more

❌ **Don't** combine unrelated tests  
→ Makes debugging harder

## Monitoring Performance

Track individual test times:

```bash
# Verbose output shows timing per test
yarn test --reporter=verbose

# Find slow tests
yarn test --reporter=verbose | grep -E "\\d+ms$" | sort -n
```

## Recommended Workflow

**During Development**:

```bash
# Work on specific test file
yarn test:watch src/__tests__/components/MyComponent.test.tsx
```

**Before Commit**:

```bash
# Run changed tests only
yarn test:changed
```

**Before Push**:

```bash
# Run full suite
yarn test
```

**In CI/CD**:

```bash
# Full suite with coverage
yarn test:coverage
```

## Actual Improvements Achieved

✅ Global mocks reduce boilerplate  
✅ Stable test execution on Windows  
✅ Better test commands for workflows  
✅ Documentation for best practices

⚠️ **Total time**: 70-75s (marginal improvement)

**Why?** The overhead (environment, imports, setup) is inherent to React component testing. The optimizations help, but can't eliminate fundamental costs.

## When to Invest More in Performance

Consider deeper optimizations if:

- Tests take > 5 minutes
- CI pipeline is blocked by tests
- Team productivity suffers
- Test suite grows to 1000+ tests

Current state (252 tests in 70s) is **reasonable** for a React app with UI component tests.

## Alternative: Test Architecture Changes

For major improvements, consider:

1. **Separate unit vs integration tests**
2. **Mock more third-party UI libraries**
3. **Use lightweight testing library** (not rendering full components)
4. **Move logic out of components** (easier to test)

These require refactoring and trade-offs in test coverage quality.
