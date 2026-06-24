/*
 * ThemeContext — Cookie Chain light/dark theme system
 * - Reads system preference (prefers-color-scheme) on first load
 * - User toggle overrides and persists to localStorage
 * - Applies .light class to <html> for light mode; no class = dark mode
 */

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  isLight: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggleTheme: () => {},
  isLight: false,
});

function getInitialTheme(): Theme {
  // 1. Check localStorage override
  const stored = localStorage.getItem("cook-theme") as Theme | null;
  if (stored === "light" || stored === "dark") return stored;
  // 2. Fall back to system preference
  if (window.matchMedia?.("(prefers-color-scheme: light)").matches) return "light";
  return "dark";
}

function applyTheme(theme: Theme) {
  const html = document.documentElement;
  if (theme === "light") {
    html.classList.add("light");
  } else {
    html.classList.remove("light");
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // SSR-safe: default to dark, will be corrected in useEffect
    return "dark";
  });

  // On mount: read real preference and apply
  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  // Listen for system preference changes (only if no localStorage override)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("cook-theme")) {
        const next: Theme = e.matches ? "light" : "dark";
        setTheme(next);
        applyTheme(next);
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      localStorage.setItem("cook-theme", next);
      applyTheme(next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isLight: theme === "light" }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
