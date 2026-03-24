import { BaseballHelmet, Books, Detective } from "@phosphor-icons/react";
import { ArticleMeta } from "../../components/global/ArticleMeta";

export const DynamicCard = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h2>
          <i className="bi bi-database-check me-4"></i>Dynamic
        </h2>
      </div>
      <div className="card-body">
        <ArticleMeta
          metadata={{
            title: "Dynamic",
            category: "home",
            author: "Ian Burrett",
            tags: ["experiment", "react", "frontend", "supabase"],
            publishedDate: "2026-03-20",
            readingTime: 3,
          }}
        />
        <div className="right w5">
          <BaseballHelmet size={64} />
        </div>
        <p>
          I recently took a notion to look at database solutions online, using
          Claude to help me, I've since migrated a majority chunk of this site
          to a mini-cms of sorts. Not using WordPress or Umbraco or the like,
          instead creating my own engine which allows me to grow the structure
          and functionality as I see fit.
        </p>
        <p>
          There still isn't any roadmap of what I want to build, but moving the
          football section to a database has been excellent as I can now add the
          new scores and cards, etc. without editing code or pushing things to
          the site. I still have things to improve their and some rough edges to
          smooth out, but it's been a fun experiment so far.
        </p>

        <div className="left w5">
          <Detective size={64} />
        </div>

        <p>
          Working with Supabase has been a great experience, with Claude guiding
          me through all the setup, sql commands, imports, etc. It's been a
          joyous learning curve and I'm really looking forward to seeing what
          and how I can build up the site. I need to get a handle on how to
          cover patches and security updates, but that's for next time...
        </p>

        <div className="right w5">
          <Books size={64} />
        </div>

        <p>
          The addition of the books page has also been a good mini-sprint inside
          the project, as a well know structure, adding images remotely and
          changing the layouts for the responsive factors also made for some
          good coding fun.
        </p>
      </div>
    </div>
  );
};
