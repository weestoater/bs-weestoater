import { Card } from "../../interfaces/interfaces";

export const CardsDetails = (props: any) => {
  const cards: any = props.cards ? props.cards : null;
  return (
    <>
      <p>
        <strong>Cards</strong>:
      </p>
      <ul className="no-bullets">
        {cards.map((item: Card, key: number) => {
          return (
            <li key={key}>
              <div
                className={`cards ${item.card}`}
                data-testid={`${item.card}card${key}`}
              ></div>
              <strong>{item.player}</strong> - {item.mins} mins
            </li>
          );
        })}
      </ul>
    </>
  );
};
