import { ArticleMeta } from "../../components/global/ArticleMeta";

export const DoingWhatWeCan = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h2>
          <i className="bi bi-bandaid me-2"></i> doing what we can
        </h2>
      </div>
      <div className="card-body">
        <ArticleMeta
          metadata={{
            title: "Doing What We Can",
            category: "about",
            author: "Ian Burrett",
            tags: ["family", "life", "accessibility", "memories"],
            publishedDate: "2026-02-27",
            readingTime: "3",
          }}
        />

        <p>
          2025 has been a bit of a roller coaster of a year, with some tragic
          parts and tremendous highs too. We lost our dear Papa Bob on Christmas
          Day '24, leaving a huge hole in all of our lives. But we also had the
          incredibly joyous occassion of seeing our kids reach their Black Belts
          in Tae Kwon Do.
        </p>

        <p>
          Our professional lives have gotten busier, when we didn't think that
          was even possible, with my beautiful wife getting a{" "}
          <strong>very well deserved</strong> promotion to her departing bosses
          role. I've enjoyed another successful year of Accessibility
          Championing at my work, being rewarded with much appreciated praise
          from my colleauges and friends.
        </p>

        <p>
          But throughout it all we still miss those we've lost this year and
          before. We carry their memories and blessings with us, as we strive to
          live up to examples they set. All you can do is try your best and hope
          that it is enough, but <em>doing what we can</em>,{" "}
          <strong>when we can</strong> is what makes us who we are.
        </p>
      </div>
    </div>
  );
};
