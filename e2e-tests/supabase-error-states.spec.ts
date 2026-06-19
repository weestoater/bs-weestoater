import { test, expect } from "@playwright/test";

test.describe("Supabase-backed page error states", () => {
  test.beforeEach(async ({ page }) => {
    // Force data requests to fail so UI error states render deterministically.
    await page.route("**/rest/v1/**", async (route) => {
      await route.abort("failed");
    });
  });

  test("books page shows error alert when data load fails", async ({
    page,
  }) => {
    await page.goto("/#/books");

    await expect(page.locator(".alert.alert-danger")).toBeVisible();
  });

  test("slimming world page shows error alert when data load fails", async ({
    page,
  }) => {
    await page.goto("/#/sw");

    await expect(page.locator(".alert.alert-danger")).toBeVisible();
  });

  test("football page shows error alert when data load fails", async ({
    page,
  }) => {
    await page.goto("/#/football");

    await expect(page.locator(".alert.alert-danger")).toBeVisible();
  });
});
