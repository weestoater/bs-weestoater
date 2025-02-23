import { PageTitleH1 } from "../components/global/pageTitleHeading";

import { EarlyAge } from "../content/landie/earlyage";
import { BirthdayTreat } from "../content/landie/birthdaytreat";

export const LandiePage = () => {
  return (
    <>
      <PageTitleH1 title="Land Rovers" />
      <BirthdayTreat />
      <EarlyAge />
    </>
  );
};
