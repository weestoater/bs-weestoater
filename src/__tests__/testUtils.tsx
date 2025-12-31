import { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

interface TestWrapperProps {
  children: ReactNode;
}

export const TestWrapper = ({ children }: TestWrapperProps) => (
  <MemoryRouter>{children}</MemoryRouter>
);
