import { Brain } from "@phosphor-icons/react";
import { ArticleMeta } from "../../components/global/ArticleMeta";

export const EthosCard = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h2>
          <i className="bi bi-house-heart me-4"></i>Ethos
        </h2>
      </div>
      <div className="card-body">
        <ArticleMeta
          metadata={{
            title: "Ethos",
            category: "home",
            author: "Ian Burrett",
            tags: ["experiment", "react", "frontend", "football"],
            publishedDate: "2026-02-27",
            readingTime: "3",
          }}
        />
        <div className="right w5">
          <Brain size={64} />
        </div>
        <p>
          I started this space as an online area for me to experiment with
          ReactJS and data 'patterns'. I've not got any desire to add a database
          or other server-side mechanisms - instead I want to concentrate purely
          on the front end aspects of rendering JSON payloads.
        </p>
        <p>
          There wasn't any roadmap of what I wanted to build, but I was
          iterating around the football details, using the Motherwell F.C.
          results as my data source,'hand-rolling' the data into two
          <code>.json</code> files:
        </p>
        <ul>
          <li>mfc-goals</li>
          <li>mfc-matches</li>
        </ul>
        <p>
          then creating a number of components to render the results onto the
          page. This works well for me so I've moved off AWS and am hosting
          elsewhere instead.
        </p>

        <p>
          That worked for a few seasons, but maintaining large files became
          combersome and I came up with the current setup instead. None of it is
          based on computer science or any other theory of how the web works,
          this is just my playground to see what works for me.
        </p>
      </div>
    </div>
  );
};
