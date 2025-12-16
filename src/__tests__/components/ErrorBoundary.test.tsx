import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "../../components/global/ErrorBoundary";

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
};

describe("ErrorBoundary", () => {
  // Suppress console.error for these tests
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("renders children when no error", () => {
    render(
      <BrowserRouter>
        <ErrorBoundary>
          <div>Child component</div>
        </ErrorBoundary>
      </BrowserRouter>
    );

    expect(screen.getByText("Child component")).toBeInTheDocument();
  });

  it("renders error UI when error is thrown", () => {
    render(
      <BrowserRouter>
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </BrowserRouter>
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it("displays error message in error UI", () => {
    render(
      <BrowserRouter>
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </BrowserRouter>
    );

    expect(screen.getByText(/unexpected error occurred/i)).toBeInTheDocument();
  });

  it("provides Try Again button", () => {
    render(
      <BrowserRouter>
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </BrowserRouter>
    );

    expect(
      screen.getByRole("button", { name: /Try Again/i })
    ).toBeInTheDocument();
  });

  it("provides Go to Home link", () => {
    render(
      <BrowserRouter>
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </BrowserRouter>
    );

    const homeLink = screen.getByRole("link", { name: /Go to Home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "#/");
  });

  it("renders custom fallback when provided", () => {
    const customFallback = <div>Custom error message</div>;

    render(
      <BrowserRouter>
        <ErrorBoundary fallback={customFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </BrowserRouter>
    );

    expect(screen.getByText("Custom error message")).toBeInTheDocument();
  });

  it("has proper CSS classes for styling", () => {
    const { container } = render(
      <BrowserRouter>
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </BrowserRouter>
    );

    expect(
      container.querySelector(".error-boundary-container")
    ).toBeInTheDocument();
    expect(
      container.querySelector(".error-boundary-content")
    ).toBeInTheDocument();
    expect(
      container.querySelector(".error-boundary-title")
    ).toBeInTheDocument();
  });
});
