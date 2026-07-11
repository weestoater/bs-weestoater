import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { BackToTop } from "../components/global/BackToTop";
import { ContentBlockGrid } from "../components/content/ContentBlockGrid";

export const AboutPage = () => {
  return (
    <>
      <PageTitleH1
        title="About"
        description="Learn about Ian Burrett, a web developer passionate about accessibility, modern web technologies, and Motherwell FC. Discover the story behind weestoater."
        keywords="Ian Burrett, about, web developer bio, Motherwell FC fan, accessibility advocate"
      />
      <ContentBlockGrid page="about" />
      <BackToTop />
    </>
  );
};
