import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { BackToTop } from "../components/global/BackToTop";
import { A11yMe } from "../content/a11y/a11yme";
import { A11yPromotion } from "../content/a11y/a11ypromotion";
import { AxePlugin } from "../content/a11y/axeplugin";
import { A11yTech } from "../content/a11y/a11itech";
import { ScreenReaders } from "../content/a11y/screenreaders";
import { A11yClaude } from "../content/a11y/a11yclaude";

export const A11yPage = () => {
  return (
    <>
      <PageTitleH1 title="Accessibility (a11y)" />
      <div className="row">
        <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4">
          <A11yClaude />
        </div>
        <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4">
          <ScreenReaders />
        </div>
        <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4">
          <A11yTech />
        </div>
        <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4">
          <A11yMe />
        </div>
        <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4">
          <A11yPromotion />
        </div>
        <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4">
          <AxePlugin />
        </div>
      </div>

      <BackToTop />
    </>
  );
};
