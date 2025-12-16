import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { NotFoundPage } from "../../pages/NotFound";

describe("NotFoundPage", () => {
  test("renders 404 page correctly", () => {
    render(
      <MemoryRouter initialEntries={["/wrong-path"]}>
        <NotFoundPage />
      </MemoryRouter>
    );

    const heading = screen.getByRole("heading", {
      name: /404 - Page Not Found/i,
    });
    expect(heading).toBeInTheDocument();
  });

  test("displays helpful links", () => {
    render(
      <MemoryRouter initialEntries={["/wrong-path"]}>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("link", { name: /Go to Homepage/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Football Section/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /React Articles/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /About/i })).toBeInTheDocument();
  });

  test("shows the invalid path", () => {
    render(
      <MemoryRouter initialEntries={["/invalid-page"]}>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/invalid-page/i)).toBeInTheDocument();
  });
});
