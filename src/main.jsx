import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import './styles/global.css';
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { CalculationHistoryProvider } from "./context/CalculationHistoryContext.jsx";
import { SettingsProvider } from "./context/SettingsContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <SettingsProvider>
            <CalculationHistoryProvider>
              <App />
            </CalculationHistoryProvider>
          </SettingsProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </ThemeProvider>
);
