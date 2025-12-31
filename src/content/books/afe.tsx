import afeCover from "../../assets/img/kalbag-AFE-cover.jpg";

export const AFEBook = () => {
  return (
    <div className="card">
      <div className="card-header">
        <i className="bi bi-book"></i> Accessibility for Everyone
      </div>
      <div className="card-body">
        <img
          src={afeCover}
          alt="Accessibility for Everyone book cover"
          className="img-fluid mb-3"
        />
        <p>
          <small>by Laura Kalbag</small>
        </p>
        <p>
          This book is an essential read for anyone involved in creating digital
          products. Laura Kalbag provides a comprehensive guide to making web
          content accessible to all users, regardless of their abilities or
          disabilities.
        </p>
        <p>
          With a foreword from the incredible{" "}
          <a
            href="https://heydonworks.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Heydon Pickering
          </a>{" "}
          you know you're in good hands. This isn't a beginners guide by any
          means, but it certainly one of the best books you can pick up if you
          have even the slightest intrest in Accessibility.
        </p>
        <p>
          By understanding the issues people with disabilities and impairments
          face, you can better advocate for inclusive design and development
          practices. In the book you'll learn how to plan for, evaluate and test
          accessible design. Leveraging tools and techniques like good
          information architecture and meaningful HTML to create a solid basis
          of best practices.
        </p>

        <p>
          Like all for the <strong>A Book Apart</strong> publications, this is a
          joy to read and not at all dry or preaching. Pick up a copy, digital
          or print and make the web a better place for everyone.
        </p>
      </div>
    </div>
  );
};
