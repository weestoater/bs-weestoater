import vsCodeScreenShot from "../../assets/img/vs-code.png";
import { ArticleMeta } from "../../components/global/ArticleMeta";

export const WhatIsWeestoater = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h2>
          <i className="bi bi-journal-code me-2"></i> what is weestoater
        </h2>
      </div>
      <img
        src={vsCodeScreenShot}
        alt="code example in VS Code"
        className="fluid"
      />
      <div className="card-body">
        <ArticleMeta
          metadata={{
            title: "What is Weestoater",
            category: "about",
            author: "Ian Burrett",
            tags: ["personal", "history", "web", "react"],
            publishedDate: "2026-02-27",
            readingTime: "2",
          }}
        />

        <p>
          <strong>weestoater</strong> is the nickname I've used for my personal
          'playgrounds' online since 1999, when I first cut my teeth in{" "}
          <code>html</code> &amp; <code>design</code>. Since then I've gone
          through a number of different efforts.
        </p>

        <ul>
          <li> A hand rolled CMS on php</li>
          <li> Numerous versions of WordPress</li>
          <li> An umbraco site, didn't last long</li>
          <li> A few Angular / AngularJS versions</li>
          <li> A couple of React sites</li>
        </ul>

        <p>
          This current version is ReactJS and Bootstrap, with some custom CSS of
          my own. I did use Salt-DS for a previous version, as I used it in a
          former team.
        </p>

        <p>
          I also want to use it to trial different experiments and implement the
          fabulous React Testing Library having completed the{" "}
          <a
            href="http://www.testingjavascript.com/"
            target="_blank"
            rel="noreferrer"
          >
            testing javascript
          </a>{" "}
          course by <strong>Kent C. Dodds</strong>. I work heavily in
          Accessibility (A11y) and I would like to flex some testing muscles
          too.
        </p>
      </div>
    </div>
  );
};
