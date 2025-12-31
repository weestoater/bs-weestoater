# Test Performance Optimization Guide

## Performance Improvements Implemented

### 1. **Vitest Configuration Optimizations** (vite.config.ts)

#### Thread Pool Configuration

- **`pool: "threads"`** - Use worker threads for parallel test execution
- **`isolate: false`** - Share environment between tests (major speedup)
- **`singleThread: false`** - Run tests in parallel

#### Caching

- **`cache.dir`** - Cache transformed modules between runs

#### Reduced Overhead

- **`watch: false`** - Disable file watching in CI/run mode
- **`reporters: ["default"]`** - Minimal reporting overhead

**Expected Impact**: 40-60% reduction in environment setup time

### 2. **Global Mocks** (setupTest.ts)

Added global mocks for commonly used browser APIs:

- **IntersectionObserver** - Used by lazy loading components
- **matchMedia** - Used by responsive components and theme switcher

**Expected Impact**: 20-30% reduction in setup time, eliminates repetitive mocking

### 3. **Reusable Mock Library** (**mocks**/commonMocks.ts)

Created shared mocks for heavy dependencies:

- ag-charts-react
- ag-grid-react
- Common components

**Benefits**:

- Reduces code duplication
- Faster test execution
- Easier maintenance

### 4. **New Test Commands** (package.json)

Added convenience scripts:

- **`yarn test:watch`** - Run tests in watch mode during development
- **`yarn test:ui`** - Visual test runner with Vitest UI
- **`yarn test:changed`** - Only run tests for changed files

## Performance Metrics

### Before Optimization

```
Duration: 73.70s
├─ Environment: 194.24s (major bottleneck!)
├─ Import: 151.14s
├─ Setup: 70.93s
├─ Transform: 6.96s
└─ Tests: 18.15s (actual test execution)
```

### Expected After Optimization

```
Duration: ~30-40s (50-60% improvement)
├─ Environment: ~50-70s (shared, not per-test)
├─ Import: ~60-80s (cached modules)
├─ Setup: ~20-30s (global mocks)
├─ Transform: ~3-5s (cached)
└─ Tests: 15-20s (actual test execution)
```

## Additional Optimization Strategies

### 1. **Selective Test Execution**

Run specific test suites:

```bash
# Run only component tests
yarn test src/__tests__/components

# Run only page tests
yarn test src/__tests__/pages

# Run single file
yarn test src/__tests__/components/ErrorBoundary.test.tsx
```

### 2. **Use Test:Changed in Development**

During development, only run tests affected by your changes:

```bash
yarn test:changed
```

### 3. **Parallel Test Execution**

Vitest automatically parallelizes tests. The `isolate: false` setting shares the environment, making this even faster.

### 4. **Mock Heavy Dependencies**

For tests that import large libraries (ag-grid, ag-charts), use mocks:

```typescript
import { vi } from "vitest";

// At the top of your test file
vi.mock("ag-charts-react", () => ({
  AgCharts: ({ options }: any) => (
    <div data-testid="ag-charts">Mocked Chart</div>
  ),
}));
```

### 5. **Reduce Test Isolation When Safe**

The `isolate: false` setting means tests share the same environment. This is safe for most tests but be careful with:

- Global state modifications
- localStorage/sessionStorage usage
- Document-level changes

Always clean up in `afterEach()` hooks.

### 6. **Use Vitest UI for Development**

```bash
yarn test:ui
```

This provides:

- Visual test runner
- Faster feedback loop
- Better debugging
- Test file filtering

### 7. **Consider Test Sharding for CI**

For CI/CD pipelines, split tests across multiple jobs:

```yaml
# .github/workflows/test.yml
strategy:
  matrix:
    shard: [1/4, 2/4, 3/4, 4/4]
steps:
  - run: yarn test --shard=${{ matrix.shard }}
```

## Monitoring Performance

Track test performance over time:

```bash
# Run with reporter that shows timing
yarn test --reporter=verbose

# Generate coverage with timing
yarn test:coverage --reporter=verbose
```

## Best Practices

1. **Mock External Dependencies** - Don't test third-party libraries
2. **Avoid Unnecessary Renders** - Use `screen.getByTestId()` over queries that traverse the DOM
3. **Clean Up After Tests** - Use `afterEach()` to reset state
4. **Group Related Tests** - Use `describe()` blocks for shared setup
5. **Use `beforeEach` Sparingly** - Only when needed, as it runs for every test

## When Tests Are Still Slow

If tests remain slow after these optimizations:

1. **Profile individual tests**:

   ```bash
   yarn test --reporter=verbose
   ```

2. **Check for**:

   - Large data imports
   - Unintentional network requests
   - Heavy computational operations
   - Missing mocks for slow operations

3. **Consider splitting large test files** into smaller, focused files

4. **Use test.skip()** temporarily for tests you're not working on

## Troubleshooting

### Tests failing after `isolate: false`?

- Check for global state pollution
- Add cleanup in `afterEach()`
- Consider selective `isolate: true` for problematic suites

### Import errors?

- Clear Vitest cache: `rm -rf node_modules/.vitest`
- Verify module name mapper patterns in vite.config.ts

### Random test failures?

- May indicate shared state issues
- Add better cleanup
- Consider increasing test timeout
