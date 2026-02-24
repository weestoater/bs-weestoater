import { MatchCard } from "../../interfaces/footballTypes";

interface CardsDetailsProps {
  cards: MatchCard[];
}

export const CardsDetails = ({ cards }: CardsDetailsProps) => {
  return (
    <div className="mb-3">
      <p className="fw-bold mb-2">Cards:</p>
      <ul className="list-unstyled d-flex flex-wrap gap-2 mb-0">
        {cards.map((item, key) => {
          return (
            <li key={key} className="d-flex align-items-center">
              <div
                className={`cards ${item.type} me-1`}
                data-testid={`${item.type}card${key}`}
              ></div>
              <strong className="me-1">{item.player}</strong>
              <span className="text-muted small">{item.minute} mins</span>
              {key < cards.length - 1 && (
                <span className="mx-2 text-muted">•</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
