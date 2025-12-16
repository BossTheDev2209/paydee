import { createContext, useContext, useEffect, useState } from "react";

const CalculationHistoryContext = createContext();

const HISTORY_KEY = "calculation-history";

// Helper function to generate unique IDs
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

export function CalculationHistoryProvider({ children }) {
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) {
        const parsedHistory = JSON.parse(saved);
        setHistory(parsedHistory);
      }
    } catch (error) {
      console.error("Failed to load calculation history:", error);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save calculation history:", error);
    }
  }, [history]);

  // Add a new calculation to history
  const addCalculation = (data) => {
    const newEntry = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      ...data
    };

    setHistory(prev => [newEntry, ...prev]);
  };

  // Remove a calculation from history
  const removeCalculation = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  // Clear all history
  const clearHistory = () => {
    setHistory([]);
  };

  // Search history
  const searchHistory = (query) => {
    if (!query.trim()) return history;

    const lowerQuery = query.toLowerCase();
    return history.filter(item => {
      // Search in inputs
      const inputsMatch = item.inputs &&
        Object.entries(item.inputs).some(([key, value]) =>
          String(value).toLowerCase().includes(lowerQuery) ||
          key.toLowerCase().includes(lowerQuery)
        );

      // Search in results
      const resultsMatch = item.results &&
        Object.entries(item.results).some(([key, value]) =>
          String(value).toLowerCase().includes(lowerQuery) ||
          key.toLowerCase().includes(lowerQuery)
        );

      // Search in calculator type
      const typeMatch = item.calculatorType &&
        item.calculatorType.toLowerCase().includes(lowerQuery);

      return inputsMatch || resultsMatch || typeMatch;
    });
  };

  // Get filtered history based on search query
  const filteredHistory = searchHistory(searchQuery);

  return (
    <CalculationHistoryContext.Provider
      value={{
        history: filteredHistory,
        allHistory: history,
        searchQuery,
        setSearchQuery,
        addCalculation,
        removeCalculation,
        clearHistory
      }}
    >
      {children}
    </CalculationHistoryContext.Provider>
  );
}

export function useCalculationHistory() {
  const context = useContext(CalculationHistoryContext);
  if (!context) {
    throw new Error("useCalculationHistory must be used within CalculationHistoryProvider");
  }
  return context;
}

