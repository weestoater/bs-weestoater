export const MyOwnTimeLine = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h2>
          <i className="bi bi-clock-history me-2"></i> My Own Timeline
        </h2>
      </div>
      <div className="card-body">
        <p>
          With a move away from a specific 'application' team in work, I'm
          concentrating more on testing technologies and Accessibility, so
          decided to strip weestoater of all things <strong>Salt DS</strong>{" "}
          related. Not because I don't like it, far from it, but because I
          couldn't keep up with their roadmap for releases and I didn't want to
          be wrangling updates, on a side-project.
        </p>

        <div className="right">
          <i className="bi bi-bootstrap icon-large"></i>
        </div>

        <p>
          So instead, I've taken the step of moving weestoater back to
          BootStrap, with Bootstrap-icons and some other tweaks here and there.
          I love the responsive grid and it's just a joy to use.
        </p>

        <div className="left">
          <i className="bi bi-code-slash icon-large"></i>
        </div>

        <p>
          I've used Bootstrap for years, in other firms and for PoC projects, to
          demonstrate the different layouts at breakpoints. I think it gets a
          bad rep because so few people try to make it look any different from
          the default themes, but with site bootswatch around, you can pretty
          quickly change it up without too much effort.
        </p>
      </div>
    </div>
  );
};
