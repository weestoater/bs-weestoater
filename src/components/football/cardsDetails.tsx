import { MatchCard } from "../../interfaces/footballTypes";

interface CardsDetailsProps {
  cards: MatchCard[];
}

export const CardsDetails = ({ cards }: CardsDetailsProps) => {
  return (
    <>
      <p>
        <strong>Cards</strong>:
      </p>
      <ul className="no-bullets">
        {cards.map((item, key) => {
          return (
            <li key={key}>
              <div
                className={`cards ${item.type}`}
                data-testid={`${item.type}card${key}`}
              ></div>
              <strong>{item.player}</strong> - {item.minute} mins
            </li>
          );
        })}
      </ul>
    </>
  );
};
