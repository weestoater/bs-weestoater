import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { BooksPage } from "../pages/Books";

describe("Books page", () => {
  test("renders page title correctly", () => {
    render(<BooksPage />);
    const heading = screen.getByTestId("page-title");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Books");
  });

  test("renders book: Designing with Web Standards", () => {
    render(<BooksPage />);
    const bookTitle = screen.getByText(/Designing with Web Standards/i);
    expect(bookTitle).toBeInTheDocument();
  });

  test("renders book: the Zen of CSS design", () => {
    render(<BooksPage />);
    const bookTitle = screen.getByText(/the Zen of CSS design/i);
    expect(bookTitle).toBeInTheDocument();
  });

  test("renders book: Accessibility for Everyone", () => {
    render(<BooksPage />);
    const bookTitle = screen.getByText(/Accessibility for Everyone/i);
    expect(bookTitle).toBeInTheDocument();
  });

  test("renders author Jeffrey Zeldman", () => {
    render(<BooksPage />);
    const author = screen.getByText(/Jeffrey Zeldman/i);
    expect(author).toBeInTheDocument();
  });

  test("renders author Laura Kalbag", () => {
    render(<BooksPage />);
    const author = screen.getByText(/by Laura Kalbag/i);
    expect(author).toBeInTheDocument();
  });

  test("has BackToTop component", () => {
    render(<BooksPage />);
    const backToTop = screen.getByRole("button", {
      name: /scroll back to top/i,
    });
    expect(backToTop).toBeInTheDocument();
  });
});
