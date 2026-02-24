import { HashRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

//--  patterns
import { Header } from "./patterns/appheader";
import { SkeletonCard } from "./components/global/SkeletonLoaders";
import { ErrorBoundary } from "./components/global/ErrorBoundary";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";

// Lazy load all pages
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
const NotFoundPage = lazy(() =>
  import("./pages/NotFound").then((module) => ({
    default: module.NotFoundPage,
  })),
);

// Admin Pages
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

export const App = () => {
  return (
    <HashRouter>
      <Header />
      <main className="container-fluid" id="content">
        <ErrorBoundary>
          <Suspense fallback={<SkeletonCard />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/a11y" element={<A11yPage />} />
              <Route path="/agile" element={<AgilePage />} />
              <Route path="/books" element={<BooksPage />} />
              <Route path="/landie" element={<LandiePage />} />
              <Route path="/football" element={<FootballPage />} />
              <Route path="/season/:seasonId" element={<SeasonPage />} />
              <Route path="/react" element={<ReactPage />} />
              <Route path="/sw" element={<SlimmingWorld />} />
              <Route path="/garmin" element={<GarminActivities />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/books"
                element={
                  <ProtectedRoute>
                    <BooksManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/books/new"
                element={
                  <ProtectedRoute>
                    <BookEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/books/edit/:id"
                element={
                  <ProtectedRoute>
                    <BookEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/articles"
                element={
                  <ProtectedRoute>
                    <ArticlesManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/articles/new"
                element={
                  <ProtectedRoute>
                    <ArticleEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/articles/edit/:id"
                element={
                  <ProtectedRoute>
                    <ArticleEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/slimming-world"
                element={
                  <ProtectedRoute>
                    <SlimmingWorldManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/football"
                element={
                  <ProtectedRoute>
                    <FootballManager />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
    </HashRouter>
  );
};
