import { SoccerBall } from "@phosphor-icons/react";
import { MatchGoal } from "../../interfaces/footballTypes";

export const GoalsDetails: React.FC<{ goals: MatchGoal[] }> = ({ goals }) => {
  return (
    <div className="mb-3">
      <p className="fw-bold mb-2">Goals:</p>
      <ul className="list-unstyled d-flex flex-wrap gap-2 mb-0">
        {goals.map((item: MatchGoal, key: number) => {
          return (
            <li key={key} className="d-flex align-items-center">
              <SoccerBall size={20} className="me-1" />
              <strong className="me-1">{item.player}</strong>
              <span className="text-muted small">{item.mins} mins</span>
              {key < goals.length - 1 && (
                <span className="mx-2 text-muted">•</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
