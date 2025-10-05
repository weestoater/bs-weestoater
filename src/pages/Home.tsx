import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { SlimLineVersionCard } from "../content/home/SlimLineVersion";
import { EthosCard } from "../content/home/EthosCard";
import { TrialnErrorCard } from "../content/home/TrialnErrorCard";

export const HomePage = () => {
  return (
    <>
      <PageTitleH1 title="Welcome" hidden={true} />
      <div className="row">
        <div className="col-lg-3 col-sm-12 mb-4">
          <SlimLineVersionCard />
        </div>
        <div className="col-lg-3 col-sm-12 mb-4">
          <EthosCard />
        </div>
        <div className="col-lg-3 col-sm-12 mb-4">
          <TrialnErrorCard />
        </div>
      </div>
    </>
  );
};
