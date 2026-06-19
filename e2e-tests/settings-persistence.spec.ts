import { test, expect } from "@playwright/test";

test.describe("Accessibility settings persistence", () => {
  test("persists selected settings across page reload", async ({ page }) => {
    await page.goto("/");

    await page
      .getByRole("button", { name: /Open accessibility settings/i })
      .click();

    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();

    await page.getByLabel("GOV.UK").check();
    await page.getByRole("button", { name: "Huge" }).click();
    await page.getByRole("button", { name: "Ubuntu" }).click();
    await page.getByRole("button", { name: /Done/i }).click();

    await expect(page.locator("html")).toHaveAttribute("data-theme", "gov-uk");
    await expect(page.locator("html")).not.toHaveAttribute(
      "data-high-contrast",
      "true",
    );

    const savedSettings = await page.evaluate(() =>
      window.localStorage.getItem("weestoater:settings"),
    );
    expect(savedSettings).toContain('"theme":"gov-uk"');
    expect(savedSettings).toContain('"fontSize":"huge"');
    expect(savedSettings).toContain('"font":"ubuntu"');

    await page.reload();

    await expect(page.locator("html")).toHaveAttribute("data-theme", "gov-uk");

    const userFontSize = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--user-font-size")
        .trim(),
    );
    expect(userFontSize).toBe("1.5rem");
  });
});
