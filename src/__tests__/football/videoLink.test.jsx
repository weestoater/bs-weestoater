import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import React from "react";
import { VideoLink } from "../../components/football/videoLinkDetails";

describe("Video Link component", () => {
  test("renders a video link", () => {
    const url = "http://foobar.com";
    render(<VideoLink url={url} />);
    const videoLink = screen.getByText(/video highlights/i);
    expect(videoLink).toBeInTheDocument();
  });
});
