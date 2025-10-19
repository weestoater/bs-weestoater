import { SoccerBall } from "@phosphor-icons/react";
import { MatchGoal } from "../../interfaces/footballTypes";

export const GoalsDetails: React.FC<{ goals: MatchGoal[] }> = ({ goals }) => {
  return (
    <>
      <p>
        <strong>Goals</strong>:
      </p>
      <ul className="no-bullets">
        {goals.map((item: MatchGoal, key: number) => {
          return (
            <li key={key}>
              <SoccerBall size={24} />
              &nbsp;
              <strong>{item.player}</strong> - {item.mins} mins
            </li>
          );
        })}
      </ul>
    </>
  );
};
