import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ReactNode } from "react";

const customRender = (component: ReactNode) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

// eslint-disable-next-line react-refresh/only-export-components
export * from "@testing-library/react";
export { customRender as render };
