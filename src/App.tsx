import { HashRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

//--  patterns
import { Header } from "./patterns/appheader";

// Lazy load all pages
const HomePage = lazy(() =>
  import("./pages/Home").then((module) => ({ default: module.HomePage }))
);
const AboutPage = lazy(() =>
  import("./pages/About").then((module) => ({ default: module.AboutPage }))
);
const A11yPage = lazy(() =>
  import("./pages/A11y").then((module) => ({ default: module.A11yPage }))
);
const AgilePage = lazy(() =>
  import("./pages/Agile").then((module) => ({ default: module.AgilePage }))
);
const FootballPage = lazy(() =>
  import("./pages/Football").then((module) => ({
    default: module.FootballPage,
  }))
);
const SeasonPage = lazy(() =>
  import("./pages/SeasonPage").then((module) => ({
    default: module.SeasonPage,
  }))
);
const ReactPage = lazy(() =>
  import("./pages/React").then((module) => ({ default: module.ReactPage }))
);
const LandiePage = lazy(() =>
  import("./pages/Landie").then((module) => ({ default: module.LandiePage }))
);
const SlimmingWorld = lazy(() =>
  import("./pages/SlimmingWorld").then((module) => ({
    default: module.SlimmingWorld,
  }))
);

export const App = () => {
  return (
    <HashRouter>
      <Header />
      <main className="container-fluid" id="content">
        <Suspense
          fallback={
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/a11y" element={<A11yPage />} />
            <Route path="/agile" element={<AgilePage />} />
            <Route path="/landie" element={<LandiePage />} />
            <Route path="/football" element={<FootballPage />} />
            <Route path="/season/:seasonId" element={<SeasonPage />} />
            <Route path="/react" element={<ReactPage />} />
            <Route path="/sw" element={<SlimmingWorld />} />
          </Routes>
        </Suspense>
      </main>
    </HashRouter>
  );
};
