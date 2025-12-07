import { SoccerBall } from "@phosphor-icons/react";
import { MatchGoal } from "../../interfaces/footballTypes";

export const GoalsDetails: React.FC<{ goals: MatchGoal[] }> = ({ goals }) => {
  return (
    <div className="mb-3">
      <p className="fw-bold mb-2">Goals:</p>
      <ul className="list-unstyled">
        {goals.map((item: MatchGoal, key: number) => {
          return (
            <li key={key} className="mb-1">
              <SoccerBall size={24} className="me-2" />
              <strong>{item.player}</strong> - {item.mins} mins
            </li>
          );
        })}
      </ul>
    </div>
  );
};
