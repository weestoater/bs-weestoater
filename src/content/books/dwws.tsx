import dwwsCover from "../../assets/img/zeldman-dwws-cover.jpg";

export const DWWSBook = () => {
  return (
    <div className="card">
      <div className="card-header">
        <i className="bi bi-book"></i> Designing with Web Standards
      </div>
      <div className="card-body">
        <img
          src={dwwsCover}
          alt="Designing with Web Standards book cover"
          className="img-fluid mb-3"
        />
        <p>
          <small>by Jeffrey Zeldman</small>
        </p>
        <p>
          This is a <strong>must read</strong> for anyone looking to work within
          the web industry. Whether a designer, developer or project manager,
          this book covers everything you should be looking for when building
          internet products.{" "}
        </p>

        <p>
          Breaking down the fundamentals of web standards and best practices, in
          a light-hearted but informative manner, Zeldman is a masterful
          storyteller who makes complex concepts accessible and engaging.
        </p>

        <p>
          Owning both 1st and 3rd editions of this book, I highly recommend it
          to anyone serious about web standards or just building better
          websites, ones that won't break on new devices or need constant tweaks
          and fixes. This is because you'll be building to the same{" "}
          <strong>standards</strong> that device manufacturers use to ensure
          compatibility and longevity. Not chasing the latest fad or trend for
          cool hip design. Content is king and the proper semantics make your
          content available to way more of an audience than the hipsters.
        </p>

        <p>To quote the great Guy Martin:</p>
        <blockquote>
          "Do it right, do it once!
          <br />
          If it's not right, it's wrong."
        </blockquote>
      </div>
    </div>
  );
};
