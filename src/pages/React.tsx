import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { ReactHooksPost } from "../content/react/ReactHooks";
import { NextThingPost } from "../content/react/NextThingPost";
import { SaltPost } from "../content/react/SaltPost";
import { ViteContent } from "../content/react/ViteReact";

export const ReactPage = () => {
  return (
    <>
      <PageTitleH1 title="React articles" />
      <ViteContent />
      <SaltPost />
      <NextThingPost />
      <ReactHooksPost />
    </>
  );
};
