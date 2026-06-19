import { test, expect } from "@playwright/test";

test.describe("Admin auth and route protection", () => {
  test("allows authenticated deep-link access to admin dashboard", async ({
    page,
  }) => {
    const nowIso = new Date().toISOString();
    const expiresAt = Math.floor(Date.now() / 1000) + 3600;
    const mockUser = {
      id: "11111111-1111-1111-1111-111111111111",
      aud: "authenticated",
      role: "authenticated",
      email: "admin@example.com",
      email_confirmed_at: nowIso,
      phone: "",
      app_metadata: { provider: "email", providers: ["email"] },
      user_metadata: {},
      identities: [],
      created_at: nowIso,
      updated_at: nowIso,
    };

    const mockSession = {
      access_token: "test-access-token",
      token_type: "bearer",
      expires_in: 3600,
      expires_at: expiresAt,
      refresh_token: "test-refresh-token",
      user: mockUser,
    };

    await page.addInitScript(
      ({ session }) => {
        window.localStorage.setItem(
          "sb-bvagseoxnweowmdwerct-auth-token",
          JSON.stringify(session),
        );
      },
      { session: mockSession },
    );

    await page.route("**/auth/v1/user**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockUser),
      });
    });

    await page.goto("/#/admin");

    await expect(page).toHaveURL(/#\/admin$/);
    await expect(
      page.getByRole("heading", { name: /Admin Dashboard/i }),
    ).toBeVisible();
  });

  test("allows login with mocked valid credentials and shows dashboard", async ({
    page,
  }) => {
    const nowIso = new Date().toISOString();
    const expiresAt = Math.floor(Date.now() / 1000) + 3600;
    const mockUser = {
      id: "11111111-1111-1111-1111-111111111111",
      aud: "authenticated",
      role: "authenticated",
      email: "admin@example.com",
      email_confirmed_at: nowIso,
      phone: "",
      app_metadata: { provider: "email", providers: ["email"] },
      user_metadata: {},
      identities: [],
      created_at: nowIso,
      updated_at: nowIso,
    };

    await page.route("**/auth/v1/token**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          access_token: "test-access-token",
          token_type: "bearer",
          expires_in: 3600,
          expires_at: expiresAt,
          refresh_token: "test-refresh-token",
          user: mockUser,
        }),
      });
    });

    await page.route("**/auth/v1/user**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockUser),
      });
    });

    await page.goto("/#/admin/login");

    await page.getByLabel("Email").fill("admin@example.com");
    await page.getByLabel("Password").fill("correct-password");
    await page.getByRole("button", { name: /Sign In/i }).click();

    await expect(page).toHaveURL(/#\/admin$/);
    await expect(
      page.getByRole("heading", { name: /Admin Dashboard/i }),
    ).toBeVisible();
  });

  test("redirects unauthenticated users from admin dashboard to login", async ({
    page,
  }) => {
    await page.goto("/#/admin");

    await expect(page).toHaveURL(/#\/admin\/login$/);
    await expect(
      page.getByRole("heading", { name: /Admin Login/i }),
    ).toBeVisible();
  });

  test("shows an error when sign in fails", async ({ page }) => {
    await page.route("**/auth/v1/token**", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          error: "invalid_grant",
          error_description: "Invalid login credentials",
        }),
      });
    });

    await page.goto("/#/admin/login");

    await page.getByLabel("Email").fill("nope@example.com");
    await page.getByLabel("Password").fill("wrong-password");
    await page.getByRole("button", { name: /Sign In/i }).click();

    await expect(page.getByRole("alert")).toContainText(
      /Invalid login credentials/i,
    );
    await expect(page).toHaveURL(/#\/admin\/login$/);
  });
});
