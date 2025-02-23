import { SoccerBall } from "@phosphor-icons/react";
import { Goals } from "../../interfaces/interfaces";

export const GoalsDetails = (props: any) => {
  const goals: any = props.goals ? props.goals : null;
  return (
    <>
      <p>
        <strong>Goals</strong>:
      </p>
      <ul className="no-bullets">
        {goals.map((item: Goals, key: number) => {
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
