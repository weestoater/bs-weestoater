import vsCodeScreenShot from "../../assets/img/vs-code.png";

export const WhatIsWeestoater = () => {
  return (
    <>
      <h2>what is weestoater</h2>
      <img
        src={vsCodeScreenShot}
        alt="code example in VS Code"
        className="fluid"
      />
      <div className="card-content">
        <p>
          <strong>weestoater</strong> is the nickname I've used for my personal
          'playgrounds' online since 1999, when I first cut my teeth in{" "}
          <code>html</code> &amp; <code>design</code>. Since then I've gone
          through a number of different efforts.
        </p>

        <ul>
          <li> A hand rolled CMS on php</li>
          <li> Numerous versions of WordPress</li>
          <li> An umbraco site - didn't last long</li>
          <li> A few Angular / AngularJS versions</li>
          <li> A couple of React sites</li>
        </ul>

        <p>
          This current version is ReactJS and Salt-DS. It is a site for me to
          play with and learn more about ReactJS and Salt-DS, as I use both
          technologies in my day job, as well as Angular; Node; Cypress;
          Playwright; Jest; Testing-Libraries and multiple CSS frameworks.
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
    </>
  );
};
