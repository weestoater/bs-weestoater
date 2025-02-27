import NextJSLogo from "../../assets/img/nextjs-logo.png";

export const NextThingPost = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h2>NextJS things Next...</h2>
      </div>
      <div className="card-body">
        <img src={NextJSLogo} alt="NextJS logo" className="right w10" />
        <p>
          On a recent works 'global hackathon' I did a small PoC using NextJS
          and Bootstrap. I really wasn't sure what to expect with NextJS, but
          somethings were really interesting and others very confusing /
          annoying.
        </p>
        <p>
          The way that NextJs looks after the '<i>server-side</i>'{" "}
          <code>api</code> is very neat and extensible. I was easily able to
          hook up my data sets and get the PoC showing actual data. This was one
          of the main issues I was aiming to overcome, so such a quick-win was
          really appreciated.
        </p>

        <p>
          Integrating <strong>agCharts</strong> to show the data was also a
          breeze, because of the support for the ReactJS libraries. Once again,
          the data was being rendered visually really swiftly and I was flying
          through my todo list.
        </p>

        <p>
          Integrating <strong>Bootstrap</strong> libraries on the other hand was{" "}
          <strong>not</strong> intuitive / as easy as I had expected it to be.
          There was a <strong>lot more googling</strong> and{" "}
          <strong>stackoverflow</strong> searching required to find a solution
          that DID work, rather than the 5 mins it takes to implement in a
          ReactJS project.
        </p>

        <p>
          Overall, I'm not sure how I feel about the NextJS framework, but I
          know several people who swear by it - and they are people I trust and
          respect - so I am probably just being picky. A couple of good
          pluralsight tutorials should probably get me through the learning
          curve and over the top of whatever issues I'm likely to encounter.{" "}
        </p>

        <p>Wish me luck - I'm going to need it.</p>
      </div>
    </div>
  );
};
