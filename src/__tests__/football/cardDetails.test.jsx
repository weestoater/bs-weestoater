import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import React from "react";
import { CardsDetails } from "../../components/football/cardsDetails";

describe("Cards Details component", () => {
  test("Can show a red card", () => {
    const mockCard = [{ player: "Mickey Mouse", card: "red", mins: "5" }];
    render(<CardsDetails cards={mockCard} />);
    const card = screen.getByTestId("redcard0");
    const player = screen.getByText(/mickey mouse/i);
    const time = screen.getByText(/5 mins/i);

    expect(card).toBeInTheDocument();
    expect(player).toBeInTheDocument();
    expect(time).toBeInTheDocument();
  });

  test("Can show a yellow card", () => {
    const mockCard = [{ player: "Goofy", card: "yellow", mins: "72" }];
    render(<CardsDetails cards={mockCard} />);
    const card = screen.getByTestId("yellowcard0");
    const player = screen.getByText(/goofy/i);
    const time = screen.getByText(/72 mins/i);

    expect(card).toBeInTheDocument();
    expect(player).toBeInTheDocument();
    expect(time).toBeInTheDocument();
  });
});
