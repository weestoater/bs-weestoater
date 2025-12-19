import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { BackToTop } from "../components/global/BackToTop";
import { SlimLineVersionCard } from "../content/home/SlimLineVersion";
import { EthosCard } from "../content/home/EthosCard";
import { TrialnErrorCard } from "../content/home/TrialnErrorCard";
import { useSEO } from "../utils/useSEO";

export const HomePage = () => {
  useSEO({
    title:
      "Ian Burrett - Web Developer & Accessibility Specialist | weestoater",
    description:
      "Full-stack web developer specializing in React, TypeScript, and accessible web design. Portfolio featuring football statistics tracking for Motherwell FC and modern web development projects.",
    keywords:
      "Ian Burrett, web developer, React developer, TypeScript, accessibility specialist, WCAG, Motherwell FC, portfolio",
  });

  return (
    <>
      <PageTitleH1 title="Welcome to weestoater" />
      <div className="row">
        <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4">
          <SlimLineVersionCard />
        </div>
        <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4">
          <EthosCard />
        </div>
        <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4">
          <TrialnErrorCard />
        </div>
      </div>

      <BackToTop />
    </>
  );
};
