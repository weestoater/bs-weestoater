export const AxePlugin = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h2>
          <i className="bi bi-universal-access-circle me-2"></i> Axe Plugin
        </h2>
      </div>
      <div className="card-body">
        <p>
          I believe in clean easy to read code, especially in my html. As part
          of my day job I help teams building web applications to make sure they
          are accessible and I always start off by getting their developers to
          install the Axe Tools for Chrome.
        </p>

        <p>
          This simple tool can give a great insight into issues teams are facing
          on the journey to a11y compliance. I especially like the fact that
          there are the four bandings:
        </p>
        <ol>
          <li>Critial</li>
          <li>Serious</li>
          <li>Moderage</li>
          <li>Minor</li>
        </ol>
        <p>
          The ability to drill down on individual items &amp;{" "}
          <strong>highlight</strong> any offending code is brilliant and gets
          across the issues a lot better than any text book ever could.
        </p>
      </div>
    </div>
  );
};
