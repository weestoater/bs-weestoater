import { test, expect } from "@playwright/test";

test.describe("Visual Regression Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("homepage layout matches snapshot", async ({ page }) => {
    await expect(page).toHaveScreenshot("homepage.png");
  });

  test("about page layout matches snapshot", async ({ page }) => {
    await page.getByRole("link", { name: "About" }).click();
    await expect(page).toHaveScreenshot("about.png");
  });

  test("football section matches snapshot", async ({ page }) => {
    await page.getByRole("link", { name: "Football" }).click();
    await expect(page).toHaveScreenshot("football.png");
  });

  test("slimming world section layout", async ({ page }) => {
    await page.goto("/#/sw");
    await expect(page).toHaveScreenshot("slimming-world.png");
  });

  test("menu toggle in mobile view", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page).toHaveScreenshot("mobile-menu-closed.png");
    await page.getByRole("button", { name: /toggle navigation/i }).click();
    await expect(page).toHaveScreenshot("mobile-menu-open.png");
  });
});
