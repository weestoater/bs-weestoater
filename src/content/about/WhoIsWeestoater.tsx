import burtIcon from "../../assets/img/burt.png";
import busterPic from "../../assets/img/buster.jpg";
import busterWebP from "../../assets/img/buster.webp";
import { ArticleMeta } from "../../components/global/ArticleMeta";

export const WhoIsWeestoater = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h2>
          <i className="bi bi-person-badge me-2"></i> who is weestoater
        </h2>
      </div>
      <div className="card-body">
        <ArticleMeta
          metadata={{
            title: "Who is Weestoater",
            category: "about",
            author: "Ian Burrett",
            tags: ["accessibility", "family", "profile", "motherwell"],
            publishedDate: "2026-02-27",
            readingTime: "2",
          }}
        />
        <img
          src={burtIcon}
          alt="avatar of weestoater"
          className="shape-circle right"
        />
        <p>
          I am Ian Burrett, an Accessibility Lead, working in Glasgow, UK and
          living just outside the fine city. Using my 25+ years of front-end web
          development and Accessibility evangelism, I help keep teams and
          applications honest in the world of accessibility.
        </p>

        <p>
          I'm a father of two amazing kids and a husband to my very long
          suffering wife. We have an adorable dog called Buster and he is the
          absolutely best boy ever - spoilt and loved to bits.
        </p>
        <picture>
          <source srcSet={busterWebP} type="image/webp" />
          <img src={busterPic} alt="Our golden lab Buster" className="fluid" />
        </picture>
        <p>
          When not working or ferrying my kids to one of their many clubs, I
          like to tinker with code / websites; listen to 'rubbish' music; watch
          weird and wonderful stuff on various streaming services.
        </p>
        <p>
          I occassionaly make it along to see Motherwell FC too and have been
          know to strum a tune on the guitar once in a blue moon.
        </p>
      </div>
    </div>
  );
};
