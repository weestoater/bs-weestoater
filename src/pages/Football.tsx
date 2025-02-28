import { useState } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";

import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { MatchDetails } from "../components/football/matchDetails";
import { GoalScorerDetails } from "../components/football/goalScorerDetails";
import mfcGoals from "../data/mfc-goals.json";
import mfcMatches from "../data/mfc-matches.json";
import { FootballIntro } from "../content/football/footballIntro";

export const FootballPage = () => {
  const seasons = [
    "2024-2025",
    "2023-2024",
    "2022-2023",
    "2021-2022",
    "2020-2021",
  ];

  const [activeTab, setActiveTab] = useState(seasons[0]);

  return (
    <div className="container-fluid">
      <PageTitleH1 title="Football" />
      <FootballIntro />

      <Nav tabs className="mt-4">
        {seasons.map((item, key) => {
          return (
            <NavItem key={key}>
              <NavLink
                onClick={() => setActiveTab(item)}
                className={item === activeTab ? "active" : ""}
              >
                {item}
              </NavLink>
            </NavItem>
          );
        })}
      </Nav>
      <TabContent activeTab={activeTab}>
        {seasons.map((item, key) => {
          return (
            <TabPane key={key} tabId={item}>
              <div className="row mt-4">
                <div className="col-lg-6">
                  <h2>
                    <i className="bi bi-calendar3 me-2"></i>
                    {item} Matches
                  </h2>
                  <MatchDetails details={mfcMatches[key].details} />
                </div>
                <div className="col-lg-6">
                  <h2>
                    <i className="bi bi-bar-chart-line me-2"></i>{" "}
                    {mfcGoals[key].season} Goals
                  </h2>
                  <GoalScorerDetails details={mfcGoals[key].details} />
                </div>
              </div>
            </TabPane>
          );
        })}
      </TabContent>
    </div>
  );
};
