import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { CardsDetails } from "../../components/football/cardsDetails";
import { MatchCard } from "../../interfaces/footballTypes";

describe("Cards Details component", () => {
  test("Can show a red card", () => {
    const mockCard: MatchCard[] = [
      { player: "Mickey Mouse", type: "red", minute: 5 },
    ];
    render(<CardsDetails cards={mockCard} />);
    const card = screen.getByTestId("redcard0");
    const player = screen.getByText(/mickey mouse/i);

    expect(card).toBeInTheDocument();
    expect(player).toBeInTheDocument();
  });

  test("Can show a yellow card", () => {
    const mockCard: MatchCard[] = [
      { player: "Goofy", type: "yellow", minute: 72 },
    ];
    render(<CardsDetails cards={mockCard} />);
    const card = screen.getByTestId("yellowcard0");
    const player = screen.getByText(/goofy/i);

    expect(card).toBeInTheDocument();
    expect(player).toBeInTheDocument();
  });
});
