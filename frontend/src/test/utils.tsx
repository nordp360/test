import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "../../context/ThemeContext";
import { AuthProvider } from "../../context/AuthContext";

// Custom render function that wraps components with all necessary providers
interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  initialRoute?: string;
}

export function renderWithProviders(
  ui: ReactElement,
  options?: CustomRenderOptions,
) {
  const { initialRoute = "/", ...renderOptions } = options || {};

  // Set initial route if provided
  if (initialRoute !== "/") {
    window.history.pushState({}, "Test page", initialRoute);
  }

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Mock data factories
export const mockUser = {
  client: {
    id: "1",
    email: "client@test.com",
    role: "client" as const,
    name: "Test Client",
  },
  lawyer: {
    id: "2",
    email: "lawyer@test.com",
    role: "lawyer" as const,
    name: "Test Lawyer",
  },
  admin: {
    id: "3",
    email: "admin@test.com",
    role: "admin" as const,
    name: "Test Admin",
  },
};

export const mockCase = {
  id: "1",
  title: "Test Case",
  description: "Test case description",
  status: "open" as const,
  createdAt: new Date().toISOString(),
  clientId: "1",
};

export const mockDocument = {
  id: "1",
  name: "test-document.pdf",
  type: "application/pdf",
  size: 1024,
  uploadedAt: new Date().toISOString(),
};

// Helper to wait for async operations
export const waitForLoadingToFinish = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

// Re-export everything from React Testing Library
export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
