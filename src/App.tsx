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
const ReactPage = lazy(() =>
  import("./pages/React").then((module) => ({ default: module.ReactPage }))
);
const LandiePage = lazy(() =>
  import("./pages/Landie").then((module) => ({ default: module.LandiePage }))
);
const FootballSeason202425 = lazy(() =>
  import("./pages/2024-25-season").then((module) => ({
    default: module.FootballSeason202425,
  }))
);
const FootballSeason202324 = lazy(() =>
  import("./pages/2023-24-season").then((module) => ({
    default: module.FootballSeason202324,
  }))
);
const FootballSeason202223 = lazy(() =>
  import("./pages/2022-23-season").then((module) => ({
    default: module.FootballSeason202223,
  }))
);
const FootballSeason202122 = lazy(() =>
  import("./pages/2021-22-season").then((module) => ({
    default: module.FootballSeason202122,
  }))
);
const FootballSeason202021 = lazy(() =>
  import("./pages/2020-21-season").then((module) => ({
    default: module.FootballSeason202021,
  }))
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
            <Route path="/2024-25-season" element={<FootballSeason202425 />} />
            <Route path="/2023-24-season" element={<FootballSeason202324 />} />
            <Route path="/2022-23-season" element={<FootballSeason202223 />} />
            <Route path="/2021-22-season" element={<FootballSeason202122 />} />
            <Route path="/2020-21-season" element={<FootballSeason202021 />} />
            <Route path="/react" element={<ReactPage />} />
            <Route path="/sw" element={<SlimmingWorld />} />
          </Routes>
        </Suspense>
      </main>
    </HashRouter>
  );
};
