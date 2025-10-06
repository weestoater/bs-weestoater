import { vi } from "vitest";

// Mock fetch API
global.fetch = vi.fn();

// Mock React Router future flags
vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: () => vi.fn(),
  useLocation: () => ({
    pathname: "/",
    search: "",
    hash: "",
    state: null,
  }),
}));
