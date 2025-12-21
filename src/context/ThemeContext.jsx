import { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("paydee-mode") || "light";
  });

  const [style, setStyle] = useState(() => {
    return localStorage.getItem("paydee-style") || "modern";
  });

  useEffect(() => {
    const html = document.documentElement;
    // Remove all related classes
    html.classList.remove("light", "dark", "theme-modern", "theme-glass", "theme-neo");
    
    // Add mode class
    html.classList.add(mode);
    
    // Add style class
    html.classList.add(`theme-${style}`);
    
    localStorage.setItem("paydee-mode", mode);
    localStorage.setItem("paydee-style", style);
  }, [mode, style]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Shift+M to toggle Light/Dark mode
      if (e.ctrlKey && e.shiftKey && e.key === "M") {
        setMode(prev => prev === "dark" ? "light" : "dark");
      }
      
      // Ctrl+Shift+1..3 for Styles
      if (e.ctrlKey && e.shiftKey) {
        if (e.key === "!") setStyle("modern");
        if (e.key === "@") setStyle("glass");
        if (e.key === "#") setStyle("neo");
      }

      // Legacy Ctrl+F toggle
      if (e.ctrlKey && e.key === "f") {
        e.preventDefault();
        setMode(prev => prev === "dark" ? "light" : "dark");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleTheme = () => setMode(prev => prev === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{ 
      mode, setMode, 
      style, setStyle, 
      isDark: mode === "dark", 
      toggleTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
