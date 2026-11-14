# Accessibility Testing Gaps & Color Contrast Issues

**Date:** November 14, 2024  
**Status:** ⚠️ Issues Identified - Action Required

---

## Summary

Your accessibility tests are missing critical coverage:

1. ❌ **Theme switching tests** - No dark/light mode testing
2. ❌ **Color contrast validation in dark mode** - Contrast not verified for theme changes
3. ⚠️ **Missing pages** - Some pages not included in tests
4. 🔴 **Confirmed color issues** - Football summary & code snippets in dark mode

---

## Missing Pages in A11y Tests

### Public Pages NOT Currently Tested
- ❌ **GarminActivities** (`/#/garmin` or similar) - Not in test list
- ⚠️ **NotFound** (`/#/invalid`) - Not tested (404 page)
- ⚠️ **IconTest** (development page) - Not tested

### Admin Pages NOT Tested (Likely Require Auth)
These require authentication, so not in automated tests:
- AdminDashboard
- AdminLogin
- ArticleEditor
- ArticlesManager
- BookEditor
- BooksManager
- ContentBlockEditor
- ContentBlocksManager
- FootballManager
- FootballPlayersManager
- MediaLibrary
- NavigationEditor
- NavigationManager
- SettingsManager
- SlimmingWorldManager

**Note:** Admin pages with media uploads (MediaLibrary, ArticleEditor, etc.) should be tested for accessibility but require authentication setup.

---

## Theme Switching NOT Tested

### Current State
✅ Tests run in **light mode only**  
❌ No **dark mode** testing  
❌ No **high contrast mode** testing  

### Impact
All color contrast violations in dark mode go undetected. This includes:
- Text readability
- Button contrast
- Icon contrast
- Form input contrast
- Table cell contrast

### Required Fix
Tests need to:
1. Run in light mode
2. Run in dark mode (using `prefers-color-scheme: dark`)
3. Run in high contrast mode
4. Validate contrast ratios in each mode

---

## Confirmed Color Issues

### Issue 1: Football Season Statistics Component
**Location:** `src/components/football/seasonStatistics.tsx`  
**Problem:** `text-muted` class on labels has poor contrast in dark mode

```typescript
<div className="text-muted" style={{ fontSize: "0.75rem" }}>
  {stat.label}
</div>
```

**Issue Details:**
- `text-muted` = `#6c757d` (light mode), darker gray in dark mode
- On dark background (#161b22), contrast ratio is likely < 4.5:1
- Violates WCAG 2.1 AA standard (requires 4.5:1 for normal text)

**Affected Elements:**
- Home Wins
- Draws
- Away Wins
- Clean Sheets
- Win Rate
- Current Clean Sheet Streak

**Fix:** Use higher contrast color or `text-secondary` in dark mode:
```typescript
<div className="text-secondary" style={{ fontSize: "0.75rem" }}>
  {stat.label}
</div>
```

Or add theme-aware styling:
```scss
.stat-label {
  color: #6c757d;
  
  @media (prefers-color-scheme: dark) {
    color: #a0a0a0; // Higher contrast in dark mode
  }
}
```

---

### Issue 2: Code Snippets/Blocks in Dark Mode
**Location:** Code blocks throughout site (TinyMCE content, blog posts, etc.)  
**Problem:** Code text color may not contrast sufficiently on dark background

**Current Styling:** `src/scss/utils/_theme.scss`
```scss
// Dark mode
code-bg: #222222
```

**Issue:**
- Code text color not explicitly defined or falls back to body text
- Light text on dark background may need adjustment
- Inline code `<code>` tags need sufficient contrast

**Affected Areas:**
- React page (code examples)
- Agile page (likely has code)
- Any article with `<code>` or `<pre>` blocks

**Fix:** Ensure code text has explicit color rules:
```scss
// In dark mode
code {
  color: #e8e8e8; // Light text for dark background
  background-color: #222222;
}

pre {
  code {
    color: #e8e8e8;
    background-color: #1e1e1e;
  }
}
```

---

## How to Test Theme Switching

### Manual Testing
1. Open any page in the app
2. Open DevTools → Command Palette → "Rendering" → "Emulate CSS media feature prefers-color-scheme"
3. Toggle between "light" and "dark"
4. Check contrast of:
   - Football statistics labels
   - Code snippets
   - Form inputs
   - Links
   - Buttons

### Use Contrast Checker
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Color.review](https://www.color-review.com/)
- Browser DevTools → Accessibility panel

---

## Proposed Test Suite Enhancements

### 1. Add Theme Switching Tests

```typescript
// e2e-tests/a11y-themes.spec.ts
import { test } from "@playwright/test";

test.describe("Accessibility with Theme Switching", () => {
  const pages = [
    { name: "Home", url: "/#/" },
    { name: "Football", url: "/#/football" },
    { name: "React", url: "/#/react" },
    // ... all pages
  ];

  pages.forEach(({ name, url }) => {
    test(`${name} in light mode has good contrast`, async ({ page }) => {
      // Ensure light mode
      await page.emulateMedia({ colorScheme: "light" });
      await page.goto(url);
      // Run axe scan
    });

    test(`${name} in dark mode has good contrast`, async ({ page }) => {
      // Test dark mode
      await page.emulateMedia({ colorScheme: "dark" });
      await page.goto(url);
      // Run axe scan
      // Validate specific color ratios
    });

    test(`${name} in high contrast mode is readable`, async ({ page }) => {
      // Test high contrast
      await page.emulateMedia({ colorScheme: "dark", forcedColors: "active" });
      await page.goto(url);
      // Run axe scan
    });
  });
});
```

### 2. Add Missing Pages to Tests

```typescript
const pages = [
  // ... existing pages
  { name: "Garmin Activities", url: "/#/garmin" },
  { name: "Not Found", url: "/#/nonexistent" },
];
```

### 3. Add Color Contrast Specific Tests

```typescript
test("Football statistics labels have sufficient contrast", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/#/football");
  
  const labels = page.locator(".stat-label"); // or selector matching labels
  
  // Verify each label has sufficient contrast
  for (const label of await labels.all()) {
    const contrastRatio = await checkContrast(page, label);
    expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
  }
});
```

---

## Priority Fixes Required

### 🔴 Critical (WCAG 2.1 AA Violation)
1. **Football Statistics Labels** - Fix `text-muted` contrast in dark mode
2. **Code Block Text** - Ensure code has sufficient contrast

### 🟠 High (Enhance Testing)
1. Add theme switching to test suite
2. Add color contrast validation for dark mode
3. Add missing pages to tests

### 🟡 Medium (Future)
1. Add admin page testing (with auth)
2. Add high contrast mode testing
3. Add keyboard navigation testing

---

## Action Items

### Immediate (This Week)
- [ ] Fix football statistics label contrast
- [ ] Fix code snippet contrast in dark mode
- [ ] Verify other `text-muted` elements in dark mode
- [ ] Test manually with color contrast checker

### Soon (Next Sprint)
- [ ] Add theme switching tests to e2e suite
- [ ] Add GarminActivities page to a11y tests
- [ ] Create automated contrast ratio validation
- [ ] Update accessibility documentation

### Future
- [ ] Add admin page testing infrastructure
- [ ] Add high contrast mode testing
- [ ] Add keyboard navigation test suite
- [ ] Add screen reader testing

---

## Testing Commands

### Manual Theme Testing
```bash
# Run dev server
npm run dev

# Open browser to http://localhost:3000
# Use DevTools Rendering tab to emulate color schemes
```

### Run Current A11y Tests (Light Mode Only)
```bash
npm run test:e2e  # Currently only tests light mode
```

### Enhanced A11y Testing (After Fixes)
```bash
npx playwright test a11y.spec.ts  # Light mode
npx playwright test a11y-themes.spec.ts  # Light + Dark + High Contrast
```

---

## Files That Need Updates

### Source Code Fixes
- `src/components/football/seasonStatistics.tsx` - Fix label contrast
- `src/scss/utils/_theme.scss` - Add code styling
- `src/scss/utils/_main.scss` - Review `text-muted` styling

### Test Suite Enhancements
- `e2e-tests/a11y.spec.ts` - Add missing pages, add theme tests
- Create new `e2e-tests/a11y-themes.spec.ts` - Theme-specific tests
- Create new `e2e-tests/a11y-contrast.spec.ts` - Contrast validation

### Documentation
- `docs/ACCESSIBILITY_TESTING_GUIDE.md` - Update with theme testing
- `docs/ACCESSIBILITY_TESTING_GAPS.md` - This file (ongoing)

---

## Resources

### Color Contrast Tools
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Color.review](https://www.color-review.com/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)

### WCAG References
- [WCAG 2.1 Color Contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [CSS Media Queries - prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [Playwright Color Scheme Emulation](https://playwright.dev/docs/api/class-browserglobalfetch#browser-context-emulate-media)

### Your Guidelines
- `/Users/ian/git/agents-memory/accessibility.instructions.md` - Section 2 "Visual design" covers contrast requirements

---

## Next Steps

1. ✅ Read this document (you are here)
2. 🔍 Manually check identified color issues in dark mode
3. 🛠️ Fix football statistics label contrast
4. 🛠️ Fix code snippet contrast
5. 📝 Update a11y tests to include theme switching
6. ✅ Run enhanced test suite
7. 📊 Generate new test reports

---

**Status:** Ready for implementation  
**Effort:** Medium (2-3 hours for fixes + enhanced tests)  
**Impact:** High (Ensures WCAG 2.1 AA compliance across all themes)
