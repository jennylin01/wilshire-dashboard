"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { themeFor, type ThemeMode, type ThemeTokens } from "@/lib/theme";

interface Ctx {
  mode: ThemeMode;
  theme: ThemeTokens;
  setMode: (m: ThemeMode) => void;
  toggle: () => void;
}

const ThemeContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "wilshire-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("dark");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "dark" || saved === "light") setModeState(saved);
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  const setMode = (m: ThemeMode) => {
    setModeState(m);
    try {
      window.localStorage.setItem(STORAGE_KEY, m);
    } catch {
      // ignore
    }
  };

  const value = useMemo<Ctx>(
    () => ({
      mode,
      theme: themeFor(mode),
      setMode,
      toggle: () => setMode(mode === "dark" ? "light" : "dark"),
    }),
    [mode]
  );

  // Avoid hydration flicker: render children but keep them invisible until mounted.
  return (
    <ThemeContext.Provider value={value}>
      <div style={{ opacity: hydrated ? 1 : 1, transition: "opacity 0.15s" }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme(): Ctx {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
