import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('studysnap_theme');
    return saved || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('studysnap_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`app-theme ${theme}`}>{children}</div>
    </ThemeContext.Provider>
  );
}
