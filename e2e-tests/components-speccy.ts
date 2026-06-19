import { test, expect } from "@playwright/test";

test.describe("Component Tests", () => {
  test("football season results display correctly", async ({ page }) => {
    await page.goto("/#/football");
    await expect(
      page.getByRole("heading", { name: /Motherwell FC Stats & Results/i }),
    ).toBeVisible();

    const statsHeading = page.getByRole("heading", { name: /Statistics/i });
    const errorAlert = page.locator(".alert.alert-danger");
    await Promise.race([
      statsHeading.waitFor({ state: "visible", timeout: 10000 }),
      errorAlert.waitFor({ state: "visible", timeout: 10000 }),
    ]);
  });

  test("slimming world data visualization", async ({ page }) => {
    await page.goto("/#/sw");
    await expect(
      page.getByRole("heading", { name: /Slimming World/i }),
    ).toBeVisible();

    const historyHeading = page.getByRole("heading", {
      name: /Weight Loss History/i,
    });
    const errorAlert = page.locator(".alert.alert-danger");
    await Promise.race([
      historyHeading.waitFor({ state: "visible", timeout: 10000 }),
      errorAlert.waitFor({ state: "visible", timeout: 10000 }),
    ]);
  });

  test("a11y features", async ({ page }) => {
    await page.goto("/#/a11y");

    // Check ARIA landmarks
    await expect(page.getByRole("navigation")).toBeVisible(); // nav menu
    await expect(page.getByRole("main")).toBeVisible(); // main content

    // Test keyboard navigation
    await page.keyboard.press("Tab");
    const firstFocusedElement = await page.evaluate(
      () => document.activeElement?.tagName ?? "",
    );
    expect(firstFocusedElement.toLowerCase()).toBe("a");
  });

  test("react section content structure", async ({ page }) => {
    await page.goto("/#/react");
    await expect(page.getByRole("heading", { name: /^React$/i })).toBeVisible();

    const articleCards = page.locator(".card");
    const errorAlert = page.locator(".alert.alert-danger");
    await Promise.race([
      articleCards.first().waitFor({ state: "visible", timeout: 10000 }),
      errorAlert.waitFor({ state: "visible", timeout: 10000 }),
    ]);
  });
});
