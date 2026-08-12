import { HashRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";

import { Header } from "./patterns/appheader";
import { SkeletonCard } from "./components/global/SkeletonLoaders";
import { ErrorBoundary } from "./components/global/ErrorBoundary";
import { appRoutes } from "./routes";

export const App = () => {
  return (
    <HashRouter>
      <Header />
      <main className="container-fluid" id="content">
        <ErrorBoundary>
          <Suspense fallback={<SkeletonCard />}>
            <Routes>
              {appRoutes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
    </HashRouter>
  );
};
