import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { ThemeProvider, useTheme } from "../ThemeContext";

describe("ThemeContext", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    // Reset document classes
    document.documentElement.className = "";
  });

  it("should initialize with light theme by default", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.theme).toBe("light");
  });

  it("should toggle theme from light to dark", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.theme).toBe("light");

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("dark");
  });

  it("should toggle theme from dark to light", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    // Toggle to dark first
    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("dark");

    // Toggle back to light
    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("light");
  });

  it("should throw error when useTheme is used outside ThemeProvider", () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      renderHook(() => useTheme());
    }).toThrow("useTheme must be used within a ThemeProvider");

    consoleSpy.mockRestore();
  });
});
