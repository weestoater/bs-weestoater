import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReactPage } from "../../pages/React";

// Mock the child components
vi.mock("../../components/global/pageTitleHeading", () => ({
  PageTitleH1: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

vi.mock("../../content/react/ReactHooks", () => ({
  ReactHooksPost: () => <div data-testid="react-hooks">React Hooks</div>,
}));

vi.mock("../../content/react/NextThingPost", () => ({
  NextThingPost: () => <div data-testid="next-thing">Next Thing</div>,
}));

vi.mock("../../content/react/SaltPost", () => ({
  SaltPost: () => <div data-testid="salt-post">Salt Post</div>,
}));

vi.mock("../../content/react/ViteReact", () => ({
  ViteContent: () => <div data-testid="vite-content">Vite Content</div>,
}));

vi.mock("../../content/react/UtilsScript", () => ({
  UtilsScript: () => <div data-testid="utils-script">Utils Script</div>,
}));

vi.mock("../../content/react/MyOwnTimeLine", () => ({
  MyOwnTimeLine: () => <div data-testid="timeline">My Own Timeline</div>,
}));

describe("ReactPage", () => {
  it("renders the page with correct title", () => {
    render(<ReactPage />);
    expect(screen.getByText("React & JS articles")).toBeInTheDocument();
  });

  it("renders all React content components", () => {
    render(<ReactPage />);
    expect(screen.getByTestId("timeline")).toBeInTheDocument();
    expect(screen.getByTestId("vite-content")).toBeInTheDocument();
    expect(screen.getByTestId("salt-post")).toBeInTheDocument();
    expect(screen.getByTestId("next-thing")).toBeInTheDocument();
    expect(screen.getByTestId("react-hooks")).toBeInTheDocument();
    expect(screen.getByTestId("utils-script")).toBeInTheDocument();
  });

  it("renders in the correct layout structure", () => {
    const { container } = render(<ReactPage />);
    const columns = container.querySelectorAll(
      ".col-xxl-3.col-xl-3.col-lg-4.col-md-6.col-sm-6.col-xs-12.mb-4"
    );
    expect(columns).toHaveLength(7);
  });
});
