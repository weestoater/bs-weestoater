import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ReactNode } from "react";

const customRender = (component: ReactNode) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

export * from "@testing-library/react";
export { customRender as render };
