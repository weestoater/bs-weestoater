import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { A11yMe } from "../content/a11y/a11yme";
import { A11yPromotion } from "../content/a11y/a11ypromotion";
import { AxePlugin } from "../content/a11y/axeplugin";
import { A11yTech } from "../content/a11y/a11itech";
import { ScreenReaders } from "../content/a11y/screenreaders";

export const A11yPage = () => {
  return (
    <>
      <PageTitleH1 title="Accessibility (a11y)" />
      <div className="grid-auto-fill">
        <ScreenReaders />
        <A11yTech />
        <A11yMe />
        <A11yPromotion />
        <AxePlugin />
      </div>
    </>
  );
};
