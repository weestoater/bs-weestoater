import { ArticleMeta } from "../../components/global/ArticleMeta";

export const UtilsScript = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h2>
          <i className="bi bi-wrench-adjustable me-2"></i> utils js class
        </h2>
      </div>
      <div className="card-body">
        <ArticleMeta
          metadata={{
            title: "utils js class",
            publishedDate: "2019-05-10",
            readingTime: 2,
            tags: [
              "JavaScript",
              "Utilities",
              "Code Snippets",
              "Helper Functions",
            ],
            category: "React",
          }}
        />
        <p>
          I've been trying to get some code of the ground for so long now, I've
          decided to log the small progress I've made here - then I won't lose
          it again & again & again.
        </p>

        <code>
          &#40;function&#40;&#41;&#123;
          <br />
          &nbsp;var utils = &#123;
          <br />
          &nbsp;&nbsp;test: function&#40;&#41;&#123;
          <br />
          &nbsp;&nbsp;&nbsp;console.log&#40;&quot;test&quot;&#41;;
          <br />
          &nbsp;&nbsp;&#125;
          <br />
          &nbsp;&#125;;
          <br />
          &nbsp;utils.test&#40;&#41;;
          <br />
          &#125;&#41;&#40;&#41;;
        </code>
      </div>
    </div>
  );
};
