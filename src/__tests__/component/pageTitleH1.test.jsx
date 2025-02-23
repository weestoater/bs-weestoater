import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import React from "react";
import { PageTitleH1 } from "../../components/global/pageTitleHeading";

describe("PageTitleH1 component", () => {
  test("renders `title` as set", () => {
    render(<PageTitleH1 title="FooBar" />);
    const heading = screen.getByTestId("page-title");
    expect(heading).toHaveTextContent("FooBar");
  });

  test("renders 'No title set' when no `title`", () => {
    render(<PageTitleH1 />);
    const heading = screen.getByTestId("page-title");
    expect(heading).toHaveTextContent("No title set");
  });
});
