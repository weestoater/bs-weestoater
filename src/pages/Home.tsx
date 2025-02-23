import { PageTitleH1 } from "../components/global/pageTitleHeading";

import { EthosCard } from "../content/home/EthosCard";
import { TrialnErrorCard } from "../content/home/TrialnErrorCard";

export const HomePage = () => {
  return (
    <>
      <PageTitleH1 title="Welcome" hidden={true} />
      <EthosCard />
      <TrialnErrorCard />
    </>
  );
};
