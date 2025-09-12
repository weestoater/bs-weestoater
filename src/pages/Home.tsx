import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { SlimLineVersionCard } from "../content/home/SlimLineVersion";
import { EthosCard } from "../content/home/EthosCard";
import { TrialnErrorCard } from "../content/home/TrialnErrorCard";

export const HomePage = () => {
  return (
    <>
      <PageTitleH1 title="Welcome" hidden={true} />
      <div className="grid-auto-fill">
        <SlimLineVersionCard />
        <EthosCard />
        <TrialnErrorCard />
      </div>
    </>
  );
};
