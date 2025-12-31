import zenCSSCover from "../../assets/img/shea-tzocd-cover.jpg";

export const CZGBook = () => {
  return (
    <div className="card">
      <div className="card-header">
        <i className="bi bi-book"></i> the Zen of CSS design
      </div>
      <div className="card-body">
        <img
          src={zenCSSCover}
          alt="The Zen of CSS Design book cover"
          className="img-fluid mb-3"
        />
        <p>
          <small>by Dave Shea &amp; Molly E. Holzschlag</small>
        </p>
        <p>
          This book came about because of the incredibly successfull{" "}
          <a
            href="http://www.csszengarden.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            CSS Zen Garden
          </a>{" "}
          project, which demonstrated the immense power of CSS based design by
          using a single HTML file styled in multiple ways.
        </p>
        <p>
          If anyone ever says CSS is boring show them the site, if they want to
          know how to do it - give them this book. Each chapter outlines a
          different factor of the process. The typography, layout, imagery, and
          more are all covered in detail.
        </p>
        <p>
          It too is written in a clear, engaging style, which leads the reader
          through the different elements with great clarity and ease. A truely
          enjoyable and uplifting read for those exploring the world of CSS
          design.
        </p>
        <p>
          Written in a time before RWD (Responsive Web Design) became
          mainstream, it offers timeless insights into CSS design principles.
          The power of the <em>cascade</em> and inheritance are touched on
          throughout the book.
        </p>
      </div>
    </div>
  );
};
