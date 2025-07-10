import { PageTitleH1 } from "../components/global/pageTitleHeading";
import { SWDataTable } from "../components/sw/swDataTable";
import swData from "../data/slimmingWorldData.json";

export const SlimmingWorld = () => {
  return (
    <>
      <PageTitleH1 title="Slimming World" />
      <div className="row">
        <div className="col-lg-6">
          <SWDataTable
            startDate={swData[0].startDate}
            startWeight={swData[0].startWeight}
            targetWeight={swData[0].targetWeight}
            data={swData[0].data}
          />
        </div>
      </div>
    </>
  );
};
