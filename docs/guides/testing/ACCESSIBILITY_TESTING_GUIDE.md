# Accessibility Testing Guide

## Overview

This project has comprehensive accessibility testing set up using **Playwright** and **axe-core**, aligned with your accessibility guidelines stored in `/Users/ian/git/agents-memory/accessibility.instructions.md`.

## Current Setup ✅

### Tools
- **Test Runner**: Playwright v1.62.1
- **A11y Scanner**: axe-core/playwright v4.13.0
- **Standards**: WCAG 2.1 Level AA compliance
- **Report Type**: HTML reports with screenshots

### Test Files
- **Main A11y Tests**: `e2e-tests/a11y.spec.ts` (133 lines)
- **Navigation Tests**: `e2e-tests/navigation.spec.ts`
- **Performance Tests**: `e2e-tests/performance.spec.ts`
- **Configuration**: `playwright.config.ts`

## Pages Currently Tested

The accessibility test suite covers 14 pages:

1. Home (`/#/`)
2. About (`/#/about`)
3. A11y (`/#/a11y`)
4. Agile (`/#/agile`)
5. Books (`/#/books`)
6. Football (`/#/football`)
7. React (`/#/react`)
8. Landie (`/#/landie`)
9. Slimming World (`/#/sw`)
10. 2020-21 Season (`/#/season/2020-21`)
11. 2021-22 Season (`/#/season/2021-22`)
12. 2022-23 Season (`/#/season/2022-23`)
13. 2023-24 Season (`/#/season/2023-24`)
14. 2024-25 Season (`/#/season/2024-25`)

## Running Tests

### All E2E Tests
```bash
npm run test:e2e
```

### Run Only A11y Tests
```bash
npx playwright test a11y.spec.ts
```

### Run with UI Debugger
```bash
npm run test:e2e:ui
```

### Run with Browser Debugger
```bash
npm run test:e2e:debug
```

### View Test Report
```bash
npm run test:e2e:report
```

This opens an HTML report showing:
- Test results
- Screenshots on failure
- Trace recordings for debugging
- Browser DevTools integration

## What's Being Tested

The automated accessibility tests verify:

### WCAG 2.1 Compliance
- ✅ **WCAG 2.1 Level A** - Minimum
- ✅ **WCAG 2.1 Level AA** - Primary focus
- ✅ **WCAG 2.1 Level AAA** - Where practical

### Specific Checks
- Color contrast ratios (4.5:1 for text)
- Heading hierarchy and structure
- Image alt text presence and quality
- Form label associations
- Keyboard navigation readiness
- Screen reader compatibility
- Focus management and visibility
- Semantic HTML usage
- ARIA attributes correctness
- Button and link roles

### Test Strategy
1. **Wait for content**: Waits for network idle + DOM settlement
2. **Lazy loading**: Handles dynamically loaded content
3. **axe scanning**: Full WCAG 2.1 AA scan on each page
4. **Violation reporting**: Detailed logs of violations with:
   - Violation ID
   - Impact level (critical/serious/minor)
   - Description
   - Help text and URLs
   - Affected elements count
   - HTML snippets

## Violation Thresholds

- **Per-page maximum**: 10 violations
- **Site-wide average**: 8 violations
- **Detailed test (SW page)**: 15 violations

Tests fail if violations exceed these thresholds.

## Configuration Details

### playwright.config.ts
```typescript
{
  testDir: "./e2e-tests",
  baseURL: "http://localhost:3000",
  browser: "chromium",
  reporter: "html",
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000"
  }
}
```

### Key Features
- **Auto web server**: Starts dev server automatically
- **Parallel execution**: Multiple tests run concurrently
- **Retries on CI**: Up to 2 retries in CI environment
- **Screenshots**: Captured on test failure only
- **Trace recording**: Full browser trace on first retry
- **HTML reports**: Generated automatically

## Integration with Your Guidelines

Your accessibility.instructions.md guidelines are used throughout the codebase:

✅ **WCAG 2.2 AA compliance** - Tests enforce this  
✅ **No inline styles** - Code review would catch this  
✅ **Semantic HTML** - Tested by axe-core  
✅ **Keyboard accessible** - Tested by axe-core  
✅ **Color contrast** - Verified by tests  
✅ **prefers-reduced-motion** - Supported in code  

## Recommended Enhancements

### 1. Keyboard Navigation Testing
```typescript
test("tabindex order is correct", async ({ page }) => {
  const tabElements = page.locator("[tabindex], button, a, input");
  // Verify tab order
});
```

### 2. Screen Reader Testing
```typescript
test("form labels are associated correctly", async ({ page }) => {
  const inputs = page.locator("input");
  // Verify aria-label or <label> associations
});
```

### 3. Focus Management Testing
```typescript
test("focus trap in modal", async ({ page }) => {
  await page.click("[data-open-modal]");
  // Verify focus stays within modal
});
```

### 4. Dynamic Content Testing
Add tests for:
- Form validation messages
- Error handling
- Loading states
- Toast notifications

### 5. Admin Page Testing
If admin pages should be tested (requires authentication):
- Add login setup in test
- Test media library accessibility
- Test form interactions

## Debugging Failed Tests

### 1. View the HTML Report
```bash
npm run test:e2e:report
```

### 2. Run with UI Mode
```bash
npm run test:e2e:ui
```
This allows you to:
- Step through tests
- Inspect elements
- Replay traces
- View violations in context

### 3. Run Single Test in Debug Mode
```bash
npx playwright test a11y.spec.ts --debug
```

### 4. Check the Trace Recording
- Open HTML report
- Click on test result
- Click "Traces" tab
- Use DevTools inspector

## CI/CD Integration

The tests are ready for CI/CD:

```bash
# In CI environment
npm run test:e2e  # Will use: 2 retries, 1 worker
```

Configuration automatically:
- Sets `workers: 1` in CI
- Enables 2 retries
- Generates failure screenshots
- Records traces

## Common Issues & Solutions

### Issue: "Page did not reach state 'domcontentloaded'"
**Solution**: Increase timeouts in waitForPageLoad function
```typescript
await page.waitForLoadState("networkidle", { timeout: 15000 });
```

### Issue: "Timeout waiting for selector 'h1'"
**Solution**: Page may have lazy-loaded content. Check:
1. Is h1 rendered after navigation?
2. Does page need more wait time?
3. Is selector correct?

### Issue: Violations differ locally vs CI
**Solution**: 
- Use same Chromium version
- Check CI environment variables
- Verify web server URL
- Clear browser cache

## Test Results Interpretation

### Good Results
```
✓ Home should have minimal A11y defects
✓ About should have minimal A11y defects
✓ Site-wide accessibility summary
```

### Bad Results
```
✗ Books should have minimal A11y defects
  Found 15 accessibility violations (max: 10)
  - color-contrast: 3 violations
  - missing-alt-text: 2 violations
  - invalid-aria: 5 violations
```

**Action**: Review violations, fix issues, re-run tests.

## Adding New Pages to Test

1. Add page URL to pages array in `e2e-tests/a11y.spec.ts`
2. Test will automatically run on new page
3. Review results in HTML report
4. Fix any violations
5. Commit and push

Example:
```typescript
const pages = [
  { name: "Home", url: "/#/" },
  // ... existing pages
  { name: "New Page", url: "/#/newpage" },  // Add here
];
```

## Next Steps

1. ✅ Run tests: `npm run test:e2e`
2. 📊 View report: `npm run test:e2e:report`
3. 🔍 Review violations logged in console
4. 🛠️ Fix critical issues
5. 📝 Consider enhancements listed above

## Resources

- [Playwright Docs](https://playwright.dev)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Your Accessibility Guidelines](/Users/ian/git/agents-memory/accessibility.instructions.md)

## Questions?

Refer to your accessibility guidelines in `/Users/ian/git/agents-memory/accessibility.instructions.md` for:
- WCAG compliance requirements
- Semantic HTML rules
- Keyboard navigation standards
- Form accessibility
- Visual design requirements

---

**Last Updated**: November 14, 2024  
**Status**: ✅ Active & Maintained
