import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { ReactHooksPost } from "../content/react/ReactHooks";
import { NextThingPost } from "../content/react/NextThingPost";
import { SaltPost } from "../content/react/SaltPost";
import { ViteContent } from "../content/react/ViteReact";
import { UtilsScript } from "../content/react/UtilsScript";

export const ReactPage = () => {
  return (
    <>
      <PageTitleH1 title="React & JS articles" />
      <div className="grid-auto-fill">
        <ViteContent />
        <SaltPost />
        <NextThingPost />
        <ReactHooksPost />
        <UtilsScript />
      </div>
    </>
  );
};
