// src/components/theme-provider.tsx
"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';

const themes = [
    { name: 'default', label: 'Default Blue' },
    { name: 'green', label: 'Neon Green' },
    { name: 'orange', label: 'Sunset Orange' },
];

interface ThemeProviderProps {
  children: React.ReactNode;
}

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  themes: typeof themes;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState('default');

  useEffect(() => {
    const storedTheme = localStorage.getItem('app-theme');
    if (storedTheme && themes.some(t => t.name === storedTheme)) {
      setThemeState(storedTheme);
      document.documentElement.setAttribute('data-theme', storedTheme);
    }
  }, []);

  const setTheme = (newTheme: string) => {
    if (themes.some(t => t.name === newTheme)) {
        setThemeState(newTheme);
        localStorage.setItem('app-theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
