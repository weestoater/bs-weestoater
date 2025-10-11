import { test, expect } from "@playwright/test";

test.describe("Performance and Error Handling", () => {
  test("lazy loading components load correctly", async ({ page }) => {
    // Start monitoring network requests
    const requests: string[] = [];
    page.on("request", (request) => {
      if (request.resourceType() === "script") {
        requests.push(request.url());
      }
    });

    // Visit homepage first
    await page.goto("/");

    // Navigate to a lazy-loaded route
    await page.getByRole("link", { name: "React" }).click();

    // Wait for the page to be fully loaded
    await page.waitForLoadState("networkidle");

    // Check if chunk was loaded
    expect(requests.some((url) => url.includes("React"))).toBeTruthy();

    // Verify content is visible
    await expect(page.getByText(/React & JS articles/i)).toBeVisible();
  });

  test("handles 404 routes gracefully", async ({ page }) => {
    // Navigate to non-existent route
    await page.goto("/non-existent-route");

    // Should redirect to home or show 404
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("football data loads and displays correctly", async ({ page }) => {
    await page.goto("/football");

    // Wait for data to load
    await expect(page.getByTestId("season-results")).toBeVisible();

    // Check for specific season data
    await page.getByRole("link", { name: /2023-24/i }).click();

    // Verify match results are displayed
    await expect(page.locator(".match-result")).toBeVisible();

    // Check goal scorers if available
    const hasGoals = (await page.locator(".goal-scorer").count()) > 0;
    if (hasGoals) {
      await expect(page.locator(".goal-scorer").first()).toBeVisible();
    }
  });

  test("responsive layout adjustments", async ({ page }) => {
    // Test desktop layout
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await expect(page.locator(".col-lg-3")).toBeVisible();

    // Test tablet layout
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator(".col-sm-12")).toBeVisible();

    // Test mobile layout
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator(".navbar-toggler")).toBeVisible();
  });

  test("image loading and optimization", async ({ page }) => {
    await page.goto("/");

    // Get all images on the page
    const images = await page.locator("img").all();

    for (const image of images) {
      // Check if image has alt text
      const altText = await image.getAttribute("alt");
      expect(altText).toBeTruthy();

      // Verify image loads successfully
      const imageSrc = await image.getAttribute("src");
      if (imageSrc) {
        const response = await page.request.get(imageSrc);
        expect(response.ok()).toBeTruthy();
      }
    }
  });
});
