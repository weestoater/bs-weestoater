import { PageTitleH1 } from "../components/global/pageTitleHeading";

import { WhatIsWeestoater } from "../content/about/WhatIsWeestoater";
import { WhoIsWeestoater } from "../content/about/WhoIsWeestoater";
import { SadMessage } from "../content/about/SadMessage";

export const AboutPage = () => {
  return (
    <>
      <PageTitleH1 title="About" />
      <div className="grid-auto-fill">
        <WhoIsWeestoater />
        <WhatIsWeestoater />
        <SadMessage />
      </div>
    </>
  );
};
