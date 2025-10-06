import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";

import {
  PageTitleH1,
  PageTitleH1Props,
} from "../../components/global/pageTitleHeading";

describe("PageTitleH1 component", () => {
  test("renders `title` as set", () => {
    const props: PageTitleH1Props = { title: "FooBar" };
    render(<PageTitleH1 {...props} />);
    const heading = screen.getByTestId("page-title");
    expect(heading).toHaveTextContent("FooBar");
  });

  test("renders 'No title set' when no `title`", () => {
    const props: PageTitleH1Props = {};
    render(<PageTitleH1 {...props} />);
    const heading = screen.getByTestId("page-title");
    expect(heading).toHaveTextContent("No title set");
  });
});
