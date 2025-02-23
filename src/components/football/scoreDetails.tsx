import { HouseLine, Barn } from "@phosphor-icons/react";

export const ScoreDetails = (props: any) => {
  const scored = props.scored ? props.scored : 0;
  const conceded = props.conceded ? props.conceded : 0;
  const venue = props.venue ? props.venue : "Home";

  let result;
  if (scored > conceded) {
    result = "Win";
  } else if (scored < conceded) {
    result = "Lost";
  } else {
    result = "Draw";
  }

  return (
    <div className="score-details">
      {venue === "Home" ? (
        <>
          <div className="icon">
            <HouseLine size={24} />
          </div>
          <div className="score">
            {result} : {scored} - {conceded}
          </div>
        </>
      ) : (
        <>
          <div className="icon">
            <Barn size={24} />
          </div>
          <div className="score">
            {result} : {conceded} - {scored}
          </div>
        </>
      )}
    </div>
  );
};
