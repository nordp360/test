import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../src/test/utils";
import { Footer } from "../Footer";

describe("Footer", () => {
  it("should render copyright information", () => {
    renderWithProviders(<Footer />);
    expect(
      screen.getByText(/© 2026 LexPortal Sp. z o.o./i),
    ).toBeInTheDocument();
  });

  it("should render legal links", () => {
    renderWithProviders(<Footer />);
    expect(screen.getByText(/Regulamin/i)).toBeInTheDocument();
    expect(screen.getByText(/Polityka Prywatności/i)).toBeInTheDocument();
  });

  it("should render contact information", () => {
    renderWithProviders(<Footer />);
    expect(screen.getByText(/pomoc@lexportal.pl/i)).toBeInTheDocument();
  });
});
