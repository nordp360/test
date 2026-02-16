import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent, act } from "@testing-library/react";
import { renderWithProviders } from "../../src/test/utils";
import ClientDashboard from "../ClientDashboard";

// Mock the modules and services to avoid real API calls
vi.mock("../../services/api", () => ({
  authApi: {
    getMe: vi.fn().mockResolvedValue({ data: { role: "client" } }),
  },
  usersApi: {
    getProfile: vi
      .fn()
      .mockResolvedValue({ data: { first_name: "Test", last_name: "User" } }),
  },
  casesApi: {
    list: vi.fn().mockResolvedValue({ data: [] }),
  },
  notificationsApi: {
    list: vi.fn().mockResolvedValue({ data: [] }),
    markRead: vi.fn().mockResolvedValue({ success: true }),
  },
  messagesApi: {
    list: vi.fn().mockResolvedValue({ data: [] }),
    send: vi.fn().mockResolvedValue({ success: true }),
  },
}));

describe("ClientDashboard Integration", () => {
  it("should render welcome message and sidebar", async () => {
    await act(async () => {
      renderWithProviders(<ClientDashboard />);
    });

    expect(screen.getByText(/Panel Klienta/i)).toBeInTheDocument();
    // Use getAllByText and check for first one to avoid ambiguity with heading/sidebar
    expect(screen.getAllByText(/Pulpit/i)[0]).toBeInTheDocument();
  });

  it("should navigate between views in the dashboard", async () => {
    await act(async () => {
      renderWithProviders(<ClientDashboard />);
    });

    // Default view is dashboard. Let's click on "Pomoc"
    const helpLink = screen.getByText(/Pomoc/i);
    await act(async () => {
      fireEvent.click(helpLink);
    });

    // Verify "Centrum Pomocy" title from renderHelp is visible
    expect(screen.getByText(/Centrum Pomocy/i)).toBeInTheDocument();
  });

  it("should open settings view", async () => {
    await act(async () => {
      renderWithProviders(<ClientDashboard />);
    });

    const settingsLink = screen.getByText(/Ustawienia/i);
    await act(async () => {
      fireEvent.click(settingsLink);
    });

    expect(screen.getByText(/Ustawienia Profilu/i)).toBeInTheDocument();
  });
});
