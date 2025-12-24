import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Breadcrumb } from "../../components/global/Breadcrumb";

describe("Breadcrumb", () => {
  it("renders breadcrumb navigation", () => {
    render(
      <BrowserRouter>
        <Breadcrumb />
      </BrowserRouter>
    );

    const nav = screen.getByRole("navigation", { name: /breadcrumb/i });
    expect(nav).toBeInTheDocument();
  });

  it("renders custom breadcrumb items", () => {
    const customItems = [
      { label: "Home", path: "/" },
      { label: "Football", path: "/football" },
      { label: "Season 2024-25", path: "/football/season/2024-25" },
    ];

    render(
      <BrowserRouter>
        <Breadcrumb customItems={customItems} />
      </BrowserRouter>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Football")).toBeInTheDocument();
    expect(screen.getByText("Season 2024-25")).toBeInTheDocument();
  });

  it("marks last item as active", () => {
    const customItems = [
      { label: "Home", path: "/" },
      { label: "Football", path: "/football" },
    ];

    render(
      <BrowserRouter>
        <Breadcrumb customItems={customItems} />
      </BrowserRouter>
    );

    const listItems = screen.getAllByRole("listitem");
    const lastItem = listItems[listItems.length - 1];
    expect(lastItem).toHaveClass("active");
    expect(lastItem).toHaveAttribute("aria-current", "page");
  });

  it("renders links for non-active items", () => {
    const customItems = [
      { label: "Home", path: "/" },
      { label: "Football", path: "/football" },
      { label: "Current", path: "/football/current" },
    ];

    render(
      <BrowserRouter>
        <Breadcrumb customItems={customItems} />
      </BrowserRouter>
    );

    const homeLink = screen.getByRole("link", { name: "Home" });
    const footballLink = screen.getByRole("link", { name: "Football" });

    expect(homeLink).toHaveAttribute("href", "/");
    expect(footballLink).toHaveAttribute("href", "/football");
  });
});
