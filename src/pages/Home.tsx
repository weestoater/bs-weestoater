import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { BackToTop } from "../components/global/BackToTop";
import { ContentBlockGrid } from "../components/content/ContentBlockGrid";

export const HomePage = () => {
  return (
    <>
      <PageTitleH1
        title="Welcome"
        description="Front end web developer specializing in React, TypeScript, and accessible web design. Portfolio featuring football statistics tracking for Motherwell FC and modern web development projects."
        keywords="Ian Burrett, web developer, React developer, TypeScript, accessibility specialist, WCAG, Motherwell FC, portfolio"
      />
      <ContentBlockGrid page="home" />

      <BackToTop />
    </>
  );
};
