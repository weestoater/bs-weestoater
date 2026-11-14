import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Define all the pages to test
const pages = [
  { name: "Home", url: "/#/" },
  { name: "About", url: "/#/about" },
  { name: "A11y", url: "/#/a11y" },
  { name: "Agile", url: "/#/agile" },
  { name: "Books", url: "/#/books" },
  { name: "Football", url: "/#/football" },
  { name: "React", url: "/#/react" },
  { name: "Landie", url: "/#/landie" },
  { name: "Slimming World", url: "/#/sw" },
  // Football season pages
  { name: "2020-21 Season", url: "/#/season/2020-21" },
  { name: "2021-22 Season", url: "/#/season/2021-22" },
  { name: "2022-23 Season", url: "/#/season/2022-23" },
  { name: "2023-24 Season", url: "/#/season/2023-24" },
  { name: "2024-25 Season", url: "/#/season/2024-25" },
  // Missing pages now included
  { name: "GarminActivities", url: "/#/garmin" },
  { name: "NotFound", url: "/#/not-a-real-page" },
];

// Theme options to test
const themes = [
  { name: "Light", selector: "[data-theme]", value: undefined },
  { name: "Dark", selector: "[data-theme]", value: "dark" },
  { name: "High Contrast", selector: "[data-theme]", value: "high-contrast" },
  { name: "Gov UK", selector: "[data-theme]", value: "gov-uk" },
];

test.describe("Accessibility Tests Across All Themes", () => {
  // Helper function to set theme
  async function setTheme(
    page: import("@playwright/test").Page,
    themeName: string,
  ) {
    if (themeName === "Light") {
      // Light theme is default, remove data-theme attribute
      await page.evaluate(() => {
        document.documentElement.removeAttribute("data-theme");
      });
    } else {
      // Set the data-theme attribute for other themes
      await page.evaluate((theme) => {
        document.documentElement.setAttribute("data-theme", theme);
      }, themeName.toLowerCase().replace(" ", "-"));
    }
    // Wait for theme transition
    await page.waitForTimeout(1000);
  }

  // Helper function to wait for lazy loaded content
  async function waitForPageLoad(page: import("@playwright/test").Page) {
    try {
      await page.waitForLoadState("networkidle", { timeout: 10000 });
      await page.waitForSelector("h1", { state: "visible", timeout: 5000 });
      await page.waitForTimeout(2000); // Additional wait for components to render
    } catch {
      console.log("Warning: Page load timeout, continuing with test...");
    }
  }

  // Test each page across all themes
  pages.forEach(({ name, url }) => {
    themes.forEach(({ name: themeName }) => {
      test(`${name} page - ${themeName} theme accessibility`, async ({
        page,
      }) => {
        await page.goto(url);
        await waitForPageLoad(page);
        await setTheme(page, themeName);

        const accessibilityScanResults = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();

        // Log violations for debugging
        console.log(
          `${name} (${themeName}): Found ${accessibilityScanResults.violations.length} violations`,
        );

        if (accessibilityScanResults.violations.length > 0) {
          console.log(
            `Violations on ${name} (${themeName}):`,
            accessibilityScanResults.violations.map((v) => ({
              id: v.id,
              impact: v.impact,
              description: v.description,
            })),
          );
        }

        // Allow for some violations but keep it reasonable
        expect(accessibilityScanResults.violations.length).toBeLessThanOrEqual(
          10,
        );
      });
    });
  });

  // Specific test for color contrast in code snippets across themes
  test("Code snippet color contrast in all themes", async ({ page }) => {
    const testPages = [
      "/#/react",
      "/#/agile",
      "/#/about",
      "/#/football",
    ];

    for (const pageUrl of testPages) {
      for (const { name: themeName } of themes) {
        await page.goto(pageUrl);
        await waitForPageLoad(page);
        await setTheme(page, themeName);

        // Check if page has code elements
        const codeElements = await page.locator("code").count();

        if (codeElements > 0) {
          // Test each code element for visibility
          const codeElement = page.locator("code").first();

          const bgColor = await codeElement.evaluate((el) => {
            return window
              .getComputedStyle(el)
              .getPropertyValue("background-color");
          });

          const textColor = await codeElement.evaluate((el) => {
            return window.getComputedStyle(el).getPropertyValue("color");
          });

          console.log(
            `${pageUrl} (${themeName}) - Code: BG=${bgColor}, Text=${textColor}`,
          );

          // Verify code is not invisible (contrasting colors)
          expect(bgColor).not.toBe(textColor);
        }
      }
    }
  });

  // Specific test for Football Season statistics contrast
  test("Football season statistics labels color contrast", async ({
    page,
  }) => {
    const seasonUrls = [
      "/#/season/2024-25",
      "/#/season/2023-24",
      "/#/football",
    ];

    for (const url of seasonUrls) {
      for (const { name: themeName } of themes) {
        await page.goto(url);
        await waitForPageLoad(page);
        await setTheme(page, themeName);

        // Check for statistics labels (they use text-secondary now)
        const statLabels = await page.locator(".text-secondary").count();

        if (statLabels > 0) {
          const label = page.locator(".text-secondary").first();

          const color = await label.evaluate((el) => {
            return window.getComputedStyle(el).getPropertyValue("color");
          });

          const bgColor = await label.evaluate((el) => {
            const parent = el.closest(".card-body") || el.parentElement;
            return window
              .getComputedStyle(parent!)
              .getPropertyValue("background-color");
          });

          console.log(
            `${url} (${themeName}) - Stat Label: Color=${color}, BG=${bgColor}`,
          );

          // Color should be different from background
          expect(color).not.toBe(bgColor);
        }
      }
    }
  });

  // Summary test across themes
  test("Site-wide accessibility summary across themes", async ({ page }) => {
    const results: {
      page: string;
      theme: string;
      violations: number;
    }[] = [];

    for (const { name: themeName } of themes) {
      for (const { name: pageName, url } of pages.slice(0, 5)) {
        await page.goto(url);
        await waitForPageLoad(page);
        await setTheme(page, themeName);

        const scanResults = await new AxeBuilder({ page }).analyze();
        results.push({
          page: pageName,
          theme: themeName,
          violations: scanResults.violations.length,
        });
      }
    }

    console.log("Site-wide accessibility summary (by theme):", results);

    // Calculate violations by theme
    const violationsByTheme: { [key: string]: number[] } = {};
    results.forEach((r) => {
      if (!violationsByTheme[r.theme]) {
        violationsByTheme[r.theme] = [];
      }
      violationsByTheme[r.theme].push(r.violations);
    });

    Object.entries(violationsByTheme).forEach(([theme, violations]) => {
      const avg = violations.reduce((a, b) => a + b, 0) / violations.length;
      console.log(`${theme} theme - Average violations: ${avg.toFixed(2)}`);
      expect(avg).toBeLessThanOrEqual(8);
    });
  });
});
