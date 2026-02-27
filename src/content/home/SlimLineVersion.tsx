import { Barbell, BowlFood } from "@phosphor-icons/react";
import { ArticleMeta } from "../../components/global/ArticleMeta";

export const SlimLineVersionCard = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h2>
          <i className="bi bi-bicycle me-4"></i>Slim Line
        </h2>
      </div>
      <div className="card-body">
        <ArticleMeta
          metadata={{
            title: "Slim Line",
            category: "home",
            author: "Ian Burrett",
            tags: ["slimming world", "weight loss", "health", "bike"],
            publishedDate: "2026-02-27",
            readingTime: "4",
          }}
        />
        <div className="right w5">
          <BowlFood size={64} />
        </div>
        <p>
          Around June '25 I joined a local Slimming World group, in order to
          drop some of the <strong>several lbs</strong> extra weight I'd picked
          up. It was done out of curiosity more than anything else, as I wanted
          to see how the group dynamic worked in person, and also to see how the
          food plan worked for me.
        </p>
        <p>
          I had some great initial success, including losing weight whilst on
          holiday down in Cornwall, at the mercy of Cornish pasties and cream
          teas (jam first!). I have been supported throughout by my wife, who
          has been brilliant at adapting meals to fit in with the plan, and
          benefiting from the extra veg and healthy options herself. I've even
          ventured out on the mountain bike with my brother for the first time
          in ages, this time not stopping every 5 minutes for a breather!
        </p>
        <div className="left w5">
          <Barbell size={64} />
        </div>
        <p>
          One of the group members referred to her journey as taking the 'scenic
          route', and that is exactly how I am aiming to approach it now myself.
          I have lost 2 stones, at this time, some days have been easier than
          others, but I want to be more honest with myself and my eating habits,
          so I don't want to sit hungry all the time either. I did a session at
          the local gym this week and felt the benefit of it the next day and on
          the scales too. This is going to be my plan going forward so watch
          this space...
        </p>
      </div>
    </div>
  );
};
