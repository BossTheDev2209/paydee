import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import './styles/global.css';
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { CalculationHistoryProvider } from "./context/CalculationHistoryContext.jsx";
import { SettingsProvider } from "./context/SettingsContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <BrowserRouter>
      <SettingsProvider>
        <CalculationHistoryProvider>
          <App />
        </CalculationHistoryProvider>
      </SettingsProvider>
    </BrowserRouter>
  </ThemeProvider>
);
