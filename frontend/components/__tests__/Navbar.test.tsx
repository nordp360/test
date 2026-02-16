import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../src/test/utils";
import Navbar from "../Navbar";

describe("Navbar", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should render logo and brand name", () => {
    renderWithProviders(<Navbar />);

    expect(screen.getByText("LexPortal")).toBeInTheDocument();
  });

  it("should render navigation links", () => {
    renderWithProviders(<Navbar />);

    expect(screen.getByText("Start")).toBeInTheDocument();
  });

  it("should render dark mode toggle button", () => {
    renderWithProviders(<Navbar />);

    const toggleButton = screen.getByRole("button", {
      name: /Przełącz na tryb/i,
    });
    expect(toggleButton).toBeInTheDocument();
  });
});
