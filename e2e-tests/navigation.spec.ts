import { test, expect } from "@playwright/test";

test.describe("Navigation and Basic Content", () => {
  test("homepage loads with correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/weestoater/);
    await expect(page.locator("h1")).toHaveText(/welcome/i);
  });

  test("navigation menu works", async ({ page }) => {
    await page.goto("/");

    // Test navigation links
    const navLinks = [
      { text: "About", url: "/about" },
      { text: "A11y", url: "/a11y" },
      { text: "Agile", url: "/agile" },
      { text: "Football", url: "/football" },
      { text: "Landie", url: "/landie" },
      { text: "React", url: "/react" },
    ];

    for (const link of navLinks) {
      await page.getByRole("link", { name: link.text }).click();
      await expect(page).toHaveURL(new RegExp(link.url));
      await expect(page.locator("h1")).toBeVisible();
    }
  });

//   test("football section displays season data", async ({ page }) => {
//     await page.goto("/football");
//     await expect(page.locator("h1")).toHaveText("Football");
//     await expect(
//       page.getByRole("img", { name: /Motherwell F\.C\. logo/i })
//     ).toBeVisible();
//   });

//   test("landie section shows stories", async ({ page }) => {
//     await page.goto("/landie");
//     await expect(page.locator("h1")).toHaveText("Land Rovers");
//     await expect(page.getByText(/Early age/)).toBeVisible();
//     await expect(page.getByText(/Birthday Treat/)).toBeVisible();
//   });

  test("skip to content link works", async ({ page }) => {
    await page.goto("/");
    const skipLink = page.getByRole("link", { name: "Skip to main content" });

    // Skip link should be initially hidden but become visible on focus
    await expect(skipLink).toBeDefined();
    await skipLink.focus();
    await expect(skipLink).toBeVisible();
  });
});
