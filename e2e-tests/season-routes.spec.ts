import { test, expect } from "@playwright/test";

test.describe("Season route validation", () => {
  test("invalid season id redirects back to football page", async ({
    page,
  }) => {
    await page.goto("/#/season/not-a-real-season");

    await expect(page).toHaveURL(/#\/football$/);
    await expect(
      page.getByRole("heading", { name: /Motherwell FC Stats & Results/i }),
    ).toBeVisible();
  });

  test("valid season id stays on season route", async ({ page }) => {
    await page.route("**/rest/v1/**", async (route) => {
      await route.abort("failed");
    });

    await page.goto("/#/season/2024-25");

    await expect(page).toHaveURL(/#\/season\/2024-25$/);
    await expect(page.locator(".alert.alert-danger")).toBeVisible();
  });

  test("season page shows an error message when data load fails", async ({
    page,
  }) => {
    await page.route("**/rest/v1/**", async (route) => {
      await route.abort("failed");
    });

    await page.goto("/#/season/2023-24");

    await expect(page).toHaveURL(/#\/season\/2023-24$/);
    await expect(page.locator(".alert.alert-danger")).toContainText(
      /Unable to load data for 2023-24 season/i,
    );
  });
});
