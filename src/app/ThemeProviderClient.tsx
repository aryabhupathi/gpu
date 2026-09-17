"use client";
import React, { createContext, useContext, useState, useMemo } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getTheme } from "./theme";
type ThemeMode = "light" | "dark";
interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType>({
  mode: "light",
  toggleTheme: () => {},
});
export const useAppTheme = () => useContext(ThemeContext);
export default function ThemeProviderClient({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme: ThemeMode;
}) {
  const [mode, setMode] = useState<ThemeMode>(initialTheme);
  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      document.cookie = `theme=${newMode}; path=/; max-age=31536000`;
      return newMode;
    });
  };
  const theme = useMemo(() => getTheme(mode), [mode]);
  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </AppRouterCacheProvider>
    </ThemeContext.Provider>
  );
}
