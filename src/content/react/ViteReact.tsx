import {
  Atom,
  FileJs,
  FileTsx,
  TestTube,
  WifiHigh,
} from "@phosphor-icons/react";
import viteLogo from "../../assets/img/logo-with-shadow.png";

export const ViteContent = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h2>
          <Atom size={32} /> Vite &amp; React-ts
        </h2>
      </div>
      <div className="card-body">
        <img src={viteLogo} className="right w10" alt="Vite logo" />
        <p>
          I've been messing about with{" "}
          <a href="http://vite.dev" target="_blank" rel="noreferrer">
            Vite
          </a>{" "}
          at work on a couple of projects and I'm really beginning to enjoy it.
        </p>
        <p>
          I've put in some <code>vitest</code> scripts and found it pretty
          painless so <strong>weestoater</strong> has been converted from:-
        </p>
        <div className="right">
          <FileJs size={64} />
        </div>
        <ul>
          <li>react-js</li>
          <li>salt-ds</li>
          <li>webpack</li>
          <li>jest</li>
        </ul>
        <p>to a slightly different config of:-</p>
        <div className="right">
          <FileTsx size={64} />
        </div>
        <ul>
          <li>
            <strong>react-ts</strong>
          </li>
          <li>salt-ds</li>
          <li>
            <strong>vite</strong>
          </li>
          <li>
            <strong>vitest</strong>
          </li>
        </ul>
        <p>
          Converting to <code>TS</code> had minimal impact, I had 75% test
          coverage on the webpack version, which I managed to improve on
          slightly in <code>vitest</code> - to 80%.
        </p>
        <div className="right">
          <TestTube size={64} />
        </div>
        <p>
          I do like the <code>@testing-library/react</code> package so hopefully
          it won't be a total rewrite, just some config settings or similar.
        </p>
        <p>
          <em>Also</em>, I'm thinking of refactoring the <code>Sass</code> for
          compiling my <code>css</code> and switching to variables instead.
        </p>
        <div className="left">
          <WifiHigh size={64} />
        </div>
        <p>
          Basically, trying to minimise the amount of bandwidth I'm using for
          the site, so compression and 'waste' management are the drivers.
        </p>
      </div>
    </div>
  );
};
