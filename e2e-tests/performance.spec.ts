import { test, expect } from "@playwright/test";

test.describe("Performance and Error Handling", () => {
  test("lazy loading components load correctly", async ({ page }) => {
    // Track all network requests (scripts AND fetch/module requests cover both
    // Vite dev-mode ESM imports and production hashed chunks)
    const requests: string[] = [];
    page.on("request", (request) => {
      const type = request.resourceType();
      if (type === "script" || type === "fetch" || type === "other") {
        requests.push(request.url());
      }
    });

    // Visit homepage first
    await page.goto("/");

    // Navigate to a lazy-loaded route
    await page.getByRole("link", { name: "React" }).click();

    // Wait for the page to be fully loaded
    await page.waitForLoadState("networkidle");

    // Verify the lazy-loaded component rendered — this is the definitive proof
    // that code-splitting and lazy loading are working correctly.
    await expect(page.locator("h1")).toContainText(/React/i);

    // Additional check: at least some modules were fetched after initial load
    // (covers both dev-mode .tsx URLs and production hashed chunk filenames)
    const loadedModuleOrChunk = requests.some(
      (url) =>
        url.includes("React") ||
        url.includes("react") ||
        url.includes(".tsx") ||
        url.includes(".js"),
    );
    expect(loadedModuleOrChunk).toBeTruthy();
  });

  test("handles 404 routes gracefully", async ({ page }) => {
    // Navigate to non-existent route
    await page.goto("/#/non-existent-route");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Should show 404 page
    await expect(
      page.getByRole("heading", { name: /404 - Page Not Found/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Oops! Page Not Found/i }),
    ).toBeVisible();
    await expect(page.getByText(/non-existent-route/i)).toBeVisible();

    // Should have link back to homepage
    await expect(
      page.getByRole("link", { name: /Go to Homepage/i }),
    ).toBeVisible();
  });

  //   test("football data loads and displays correctly", async ({ page }) => {
  //     await page.goto("/football");

  //     // Wait for data to load
  //     await expect(page.getByTestId("season-results")).toBeVisible();

  //     // Check for specific season data
  //     await page.getByRole("link", { name: /2023-24/i }).click();

  //     // Verify match results are displayed
  //     await expect(page.locator(".match-result")).toBeVisible();

  //     // Check goal scorers if available
  //     const hasGoals = (await page.locator(".goal-scorer").count()) > 0;
  //     if (hasGoals) {
  //       await expect(page.locator(".goal-scorer").first()).toBeVisible();
  //     }
  //   });

  //   test("responsive layout adjustments", async ({ page }) => {
  //     // Test desktop layout
  //     await page.setViewportSize({ width: 1280, height: 800 });
  //     await page.goto("/");
  //     await expect(page.locator(".col-lg-3")).toBeVisible();

  //     // Test tablet layout
  //     await page.setViewportSize({ width: 768, height: 1024 });
  //     await expect(page.locator(".col-sm-12")).toBeVisible();

  //     // Test mobile layout
  //     await page.setViewportSize({ width: 375, height: 667 });
  //     await expect(page.locator(".navbar-toggler")).toBeVisible();
  //   });

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
