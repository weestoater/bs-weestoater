import { HouseLine, Barn } from "@phosphor-icons/react";
import { calculateMatchResult, formatScore } from "../../utils/footballUtils";

interface Props {
  scored: number;
  conceded: number;
  venue: string;
}

export const ScoreDetails = ({
  scored = 0,
  conceded = 0,
  venue = "Home",
}: Props) => {
  const matchResult = calculateMatchResult(scored, conceded);
  const resultText = {
    W: "Win",
    D: "Draw",
    L: "Lost",
  }[matchResult];

  return (
    <div className="score-details">
      {venue === "Home" ? (
        <>
          <div className="icon">
            <HouseLine size={24} />
          </div>
          <div className="score">
            {resultText} : {formatScore(scored, conceded, venue)}
          </div>
        </>
      ) : (
        <>
          <div className="icon">
            <Barn size={24} />
          </div>
          <div className="score">
            {resultText} : {formatScore(scored, conceded, venue)}
          </div>
        </>
      )}
    </div>
  );
};
