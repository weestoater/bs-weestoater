import { HashRouter, Routes, Route } from "react-router-dom";

//--  patterns
import { Header } from "./patterns/appheader";

//--  pages
import { HomePage } from "./pages/Home";
import { AboutPage } from "./pages/About";
import { A11yPage } from "./pages/A11y";
import { AgilePage } from "./pages/Agile";
import { FootballPage } from "./pages/Football";
import { ReactPage } from "./pages/React";
import { LandiePage } from "./pages/Landie";
import { FootballSeason202425 } from "./pages/2024-25-season";
import { FootballSeason202324 } from "./pages/2023-24-season";
import { FootballSeason202223 } from "./pages/2022-23-season";
import { FootballSeason202122 } from "./pages/2021-22-season";
import { FootballSeason202021 } from "./pages/2020-21-season";
import { SlimmingWorld } from "./pages/SlimmingWorld";

export const App = () => {
  return (
    <HashRouter>
      <Header />
      <main className="container-fluid" id="content">
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
      </main>
    </HashRouter>
  );
};
