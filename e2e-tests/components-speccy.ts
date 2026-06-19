import { test, expect } from "@playwright/test";

test.describe("Component Tests", () => {
  test("football season results display correctly", async ({ page }) => {
    await page.goto("/football");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByTestId("season-results")).toBeVisible();

    // Check navigation to specific seasons
    const seasons = ["2023-24", "2022-23", "2021-22", "2020-21"];
    for (const season of seasons) {
      const link = page.getByRole("link", { name: new RegExp(season, "i") });
      await link.click();
      await expect(
        page.getByText(new RegExp(`Season: ${season}`, "i"))
      ).toBeVisible();
    }
  });

  test("slimming world data visualization", async ({ page }) => {
    await page.goto("/slimmingWorld");
    await expect(page.getByTestId("sw-data-table")).toBeVisible();
    await expect(page.getByTestId("ag-charts")).toBeVisible();

    // Verify data table content
    await expect(page.getByText(/start weight/i)).toBeVisible();
    await expect(page.getByText(/target weight/i)).toBeVisible();
    await expect(page.getByText(/start date/i)).toBeVisible();
  });

  test("a11y features", async ({ page }) => {
    await page.goto("/a11y");

    // Check ARIA landmarks
    await expect(page.getByRole("banner")).toBeVisible(); // header
    await expect(page.getByRole("navigation")).toBeVisible(); // nav menu
    await expect(page.getByRole("main")).toBeVisible(); // main content

    // Test keyboard navigation
    await page.keyboard.press("Tab");
    const firstFocusedElement = await page.evaluate(
      () => document.activeElement?.tagName ?? ""
    );
    expect(firstFocusedElement.toLowerCase()).toBe("a");
  });

  test("react section content structure", async ({ page }) => {
    await page.goto("/react");

    // Check all article sections are present
    await expect(page.getByTestId("timeline")).toBeVisible();
    await expect(page.getByTestId("vite-content")).toBeVisible();
    await expect(page.getByTestId("salt-post")).toBeVisible();
    await expect(page.getByTestId("next-thing")).toBeVisible();
    await expect(page.getByTestId("react-hooks")).toBeVisible();
    await expect(page.getByTestId("utils-script")).toBeVisible();
  });
});
