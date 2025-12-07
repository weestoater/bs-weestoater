import { MatchCard } from "../../interfaces/footballTypes";

interface CardsDetailsProps {
  cards: MatchCard[];
}

export const CardsDetails = ({ cards }: CardsDetailsProps) => {
  return (
    <div className="mb-3">
      <p className="fw-bold mb-2">Cards:</p>
      <ul className="list-unstyled">
        {cards.map((item, key) => {
          return (
            <li key={key} className="d-flex align-items-center mb-1">
              <div
                className={`cards ${item.type} me-2`}
                data-testid={`${item.type}card${key}`}
              ></div>
              <strong>{item.player}</strong> - {item.minute} mins
            </li>
          );
        })}
      </ul>
    </div>
  );
};
