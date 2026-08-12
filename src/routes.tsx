import { lazy } from "react";
import type { ReactNode } from "react";

import { ProtectedRoute } from "./components/admin/ProtectedRoute";

const HomePage = lazy(() =>
  import("./pages/Home").then((module) => ({ default: module.HomePage })),
);
const AboutPage = lazy(() =>
  import("./pages/About").then((module) => ({ default: module.AboutPage })),
);
const A11yPage = lazy(() =>
  import("./pages/A11y").then((module) => ({ default: module.A11yPage })),
);
const AgilePage = lazy(() =>
  import("./pages/Agile").then((module) => ({ default: module.AgilePage })),
);
const BooksPage = lazy(() =>
  import("./pages/Books").then((module) => ({ default: module.BooksPage })),
);
const FootballPage = lazy(() =>
  import("./pages/Football").then((module) => ({
    default: module.FootballPage,
  })),
);
const SeasonPage = lazy(() =>
  import("./pages/SeasonPage").then((module) => ({
    default: module.SeasonPage,
  })),
);
const ReactPage = lazy(() =>
  import("./pages/React").then((module) => ({ default: module.ReactPage })),
);
const LandiePage = lazy(() =>
  import("./pages/Landie").then((module) => ({ default: module.LandiePage })),
);
const SlimmingWorld = lazy(() =>
  import("./pages/SlimmingWorld").then((module) => ({
    default: module.SlimmingWorld,
  })),
);
const GarminActivities = lazy(() =>
  import("./pages/GarminActivities").then((module) => ({
    default: module.GarminActivities,
  })),
);
const IconTest = lazy(() =>
  import("./pages/IconTest").then((module) => ({
    default: module.IconTest,
  })),
);
const NotFoundPage = lazy(() =>
  import("./pages/NotFound").then((module) => ({
    default: module.NotFoundPage,
  })),
);

const AdminLogin = lazy(() =>
  import("./pages/admin/AdminLogin").then((module) => ({
    default: module.AdminLogin,
  })),
);
const AdminDashboard = lazy(() =>
  import("./pages/admin/AdminDashboard").then((module) => ({
    default: module.AdminDashboard,
  })),
);
const BooksManager = lazy(() =>
  import("./pages/admin/BooksManager").then((module) => ({
    default: module.BooksManager,
  })),
);
const BookEditor = lazy(() =>
  import("./pages/admin/BookEditor").then((module) => ({
    default: module.BookEditor,
  })),
);
const ContentBlocksManager = lazy(() =>
  import("./pages/admin/ContentBlocksManager").then((module) => ({
    default: module.ContentBlocksManager,
  })),
);
const ContentBlockEditor = lazy(() =>
  import("./pages/admin/ContentBlockEditor").then((module) => ({
    default: module.ContentBlockEditor,
  })),
);
const NavigationManager = lazy(() =>
  import("./pages/admin/NavigationManager").then((module) => ({
    default: module.NavigationManager,
  })),
);
const NavigationEditor = lazy(() =>
  import("./pages/admin/NavigationEditor").then((module) => ({
    default: module.NavigationEditor,
  })),
);
const ArticlesManager = lazy(() =>
  import("./pages/admin/ArticlesManager").then((module) => ({
    default: module.ArticlesManager,
  })),
);
const ArticleEditor = lazy(() =>
  import("./pages/admin/ArticleEditor").then((module) => ({
    default: module.ArticleEditor,
  })),
);
const SlimmingWorldManager = lazy(() =>
  import("./pages/admin/SlimmingWorldManager").then((module) => ({
    default: module.SlimmingWorldManager,
  })),
);
const FootballManager = lazy(() =>
  import("./pages/admin/FootballManager").then((module) => ({
    default: module.FootballManager,
  })),
);
const FootballPlayersManager = lazy(() =>
  import("./pages/admin/FootballPlayersManager").then((module) => ({
    default: module.FootballPlayersManager,
  })),
);
const SettingsManager = lazy(() =>
  import("./pages/admin/SettingsManager").then((module) => ({
    default: module.SettingsManager,
  })),
);
const MediaLibrary = lazy(() =>
  import("./pages/admin/MediaLibrary").then((module) => ({
    default: module.MediaLibrary,
  })),
);

const withProtectedRoute = (element: ReactNode) => (
  <ProtectedRoute>{element}</ProtectedRoute>
);

export const appRoutes = [
  { path: "/", element: <HomePage /> },
  { path: "/home", element: <HomePage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/a11y", element: <A11yPage /> },
  { path: "/agile", element: <AgilePage /> },
  { path: "/books", element: <BooksPage /> },
  { path: "/landie", element: <LandiePage /> },
  { path: "/football", element: <FootballPage /> },
  { path: "/season/:seasonId", element: <SeasonPage /> },
  { path: "/react", element: <ReactPage /> },
  { path: "/sw", element: <SlimmingWorld /> },
  { path: "/garmin", element: <GarminActivities /> },
  { path: "/icon-test", element: <IconTest /> },
  { path: "/admin/login", element: <AdminLogin /> },
  { path: "/admin", element: withProtectedRoute(<AdminDashboard />) },
  { path: "/admin/books", element: withProtectedRoute(<BooksManager />) },
  { path: "/admin/books/new", element: withProtectedRoute(<BookEditor />) },
  {
    path: "/admin/books/edit/:id",
    element: withProtectedRoute(<BookEditor />),
  },
  {
    path: "/admin/content-blocks",
    element: withProtectedRoute(<ContentBlocksManager />),
  },
  {
    path: "/admin/content-blocks/new",
    element: withProtectedRoute(<ContentBlockEditor />),
  },
  {
    path: "/admin/content-blocks/edit/:id",
    element: withProtectedRoute(<ContentBlockEditor />),
  },
  {
    path: "/admin/navigation",
    element: withProtectedRoute(<NavigationManager />),
  },
  {
    path: "/admin/navigation/new",
    element: withProtectedRoute(<NavigationEditor />),
  },
  {
    path: "/admin/navigation/edit/:id",
    element: withProtectedRoute(<NavigationEditor />),
  },
  {
    path: "/admin/articles",
    element: withProtectedRoute(<ArticlesManager />),
  },
  {
    path: "/admin/articles/new",
    element: withProtectedRoute(<ArticleEditor />),
  },
  {
    path: "/admin/articles/edit/:id",
    element: withProtectedRoute(<ArticleEditor />),
  },
  {
    path: "/admin/slimming-world",
    element: withProtectedRoute(<SlimmingWorldManager />),
  },
  {
    path: "/admin/football",
    element: withProtectedRoute(<FootballManager />),
  },
  {
    path: "/admin/football/players",
    element: withProtectedRoute(<FootballPlayersManager />),
  },
  {
    path: "/admin/settings",
    element: withProtectedRoute(<SettingsManager />),
  },
  {
    path: "/admin/media",
    element: withProtectedRoute(<MediaLibrary />),
  },
  { path: "*", element: <NotFoundPage /> },
];
