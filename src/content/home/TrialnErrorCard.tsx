import { CodesandboxLogo, ImageBroken } from "@phosphor-icons/react";
import { ArticleMeta } from "../../components/global/ArticleMeta";

export const TrialnErrorCard = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h2>
          <i className="bi bi-bug me-4"></i>trial &amp; error
        </h2>
      </div>
      <div className="card-body">
        <ArticleMeta
          metadata={{
            title: "Trial & Error",
            category: "home",
            author: "Ian Burrett",
            tags: ["learning", "mistakes", "aws", "git"],
            publishedDate: "2026-02-27",
            readingTime: "2",
          }}
        />
        <div className="right w5">
          <ImageBroken size={64} />
        </div>
        <p>
          Ideally I want to learn as much as possible in building this site, as
          I have the freedom to make as many mistakes as I like.
        </p>
        <p>
          Afterall, it's only a <code>git pull</code> away from being removed or
          over-written, so I don't want to be precious.
        </p>
        <div className="left w5">
          <CodesandboxLogo size={64} />
        </div>
        <p>
          I've learned enough about AWS to know I <em>don't</em> want to use it
          for my personal sites anymore. But also enough to appreciate and
          understand how to use it in my works capacity.
        </p>
      </div>
    </div>
  );
};
