import { test, expect } from "@playwright/test";

test.describe("Hash route direct-load and refresh behavior", () => {
  test("about route works on direct load and after refresh", async ({
    page,
  }) => {
    await page.goto("/#/about");

    await expect(page).toHaveURL(/#\/about$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    await page.reload();

    await expect(page).toHaveURL(/#\/about$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("valid season route stays stable across refresh", async ({ page }) => {
    await page.route("**/rest/v1/**", async (route) => {
      await route.abort("failed");
    });

    await page.goto("/#/season/2024-25");

    await expect(page).toHaveURL(/#\/season\/2024-25$/);
    await expect(page.locator(".alert.alert-danger")).toBeVisible();

    await page.reload();

    await expect(page).toHaveURL(/#\/season\/2024-25$/);
    await expect(page.locator(".alert.alert-danger")).toBeVisible();
  });
});
