import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { NotesDetails } from "../../components/football/NotesDetails";

describe("Notes Details component", () => {
  test("renders what it is given", () => {
    const mockNotes = "Mary had a little lamb...";
    render(<NotesDetails notes={mockNotes} />);
    const notes = screen.getByText(/mary had a little lamb/i);
    expect(notes).toBeInTheDocument();
  });
});
