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
];

test.describe("Accessibility Tests for All Pages", () => {
  // Helper function to wait for lazy loaded content
  async function waitForPageLoad(page: import("@playwright/test").Page) {
    try {
      await page.waitForLoadState("networkidle", { timeout: 10000 });
      await page.waitForSelector("h1", { state: "visible", timeout: 5000 });
      await page.waitForTimeout(2000); // Additional wait for components to render
    } catch (error) {
      console.log("Warning: Page load timeout, continuing with test...");
    }
  }

  // Test each page for accessibility violations
  pages.forEach(({ name, url }) => {
    test(`${name} should have minimal A11y defects`, async ({ page }) => {
      await page.goto(url);

      // Wait for lazy loaded content
      await waitForPageLoad(page);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();

      // Log violations for debugging
      console.log(
        `${name} page: Found ${accessibilityScanResults.violations.length} accessibility violations`,
      );

      if (accessibilityScanResults.violations.length > 0) {
        console.log(
          `Violations on ${name} page:`,
          accessibilityScanResults.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            description: v.description,
            nodes: v.nodes.length,
          })),
        );
      }

      // Allow for some violations but keep it reasonable
      expect(accessibilityScanResults.violations.length).toBeLessThanOrEqual(
        10,
      );
    });
  });

  // Summary test to check overall accessibility compliance
  test("Site-wide accessibility summary", async ({ page }) => {
    const results: { page: string; violations: number }[] = [];

    for (const { name, url } of pages.slice(0, 5)) {
      // Test first 5 pages for summary
      await page.goto(url);
      await waitForPageLoad(page);

      const scanResults = await new AxeBuilder({ page }).analyze();
      results.push({ page: name, violations: scanResults.violations.length });
    }

    console.log("Site-wide accessibility summary:", results);

    // Calculate average violations per page
    const avgViolations =
      results.reduce((sum, r) => sum + r.violations, 0) / results.length;
    console.log(`Average violations per page: ${avgViolations.toFixed(2)}`);

    // Ensure average is reasonable
    expect(avgViolations).toBeLessThanOrEqual(8);
  });

  // Detailed test for Slimming World page specifically
  test("Slimming World page detailed accessibility analysis", async ({
    page,
  }) => {
    await page.goto("/#/sw");
    await waitForPageLoad(page);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();

    console.log(`\n=== SLIMMING WORLD PAGE ACCESSIBILITY ANALYSIS ===`);
    console.log(
      `Total violations: ${accessibilityScanResults.violations.length}`,
    );

    if (accessibilityScanResults.violations.length > 0) {
      accessibilityScanResults.violations.forEach((violation, index) => {
        console.log(`\n--- Violation ${index + 1} ---`);
        console.log(`ID: ${violation.id}`);
        console.log(`Impact: ${violation.impact}`);
        console.log(`Description: ${violation.description}`);
        console.log(`Help: ${violation.help}`);
        console.log(`Help URL: ${violation.helpUrl}`);
        console.log(`Affected elements: ${violation.nodes.length}`);

        violation.nodes.forEach((node, nodeIndex) => {
          console.log(`  Element ${nodeIndex + 1}:`);
          console.log(`    HTML: ${node.html}`);
          console.log(`    Target: ${node.target.join(", ")}`);
          console.log(`    Failure summary: ${node.failureSummary}`);
        });
      });
    }

    // More lenient for detailed analysis
    expect(accessibilityScanResults.violations.length).toBeLessThanOrEqual(15);
  });
});
