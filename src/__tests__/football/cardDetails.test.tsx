import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { CardsDetails } from "../../components/football/cardsDetails";
import { CardType } from "../../interfaces/footballTypes";

describe("Cards Details component", () => {
  test("Can show a red card", () => {
    const mockCard: CardType[] = [
      { player: "Mickey Mouse", card: "red", mins: "5" },
    ];
    render(<CardsDetails cards={mockCard} />);
    const card = screen.getByTestId("redcard0");
    const player = screen.getByText(/mickey mouse/i);

    expect(card).toBeInTheDocument();
    expect(player).toBeInTheDocument();
  });

  test("Can show a yellow card", () => {
    const mockCard: CardType[] = [
      { player: "Goofy", card: "yellow", mins: "72" },
    ];
    render(<CardsDetails cards={mockCard} />);
    const card = screen.getByTestId("yellowcard0");
    const player = screen.getByText(/goofy/i);

    expect(card).toBeInTheDocument();
    expect(player).toBeInTheDocument();
  });
});
