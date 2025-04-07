import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    return savedTheme || "system";
  });
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Save preference to localStorage
    localStorage.setItem("theme", theme);
    
    // Handle system preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const applyTheme = () => {
      const prefersDark = mediaQuery.matches;
      const shouldBeDark = theme === "dark" || (theme === "system" && prefersDark);
      
      setIsDarkMode(shouldBeDark);
      document.documentElement.classList.toggle("dark", shouldBeDark);
    };
    
    // Initial theme application
    applyTheme();
    
    // Listen for system preference changes
    const listener = () => applyTheme();
    mediaQuery.addEventListener("change", listener);
    
    return () => {
      mediaQuery.removeEventListener("change", listener);
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
