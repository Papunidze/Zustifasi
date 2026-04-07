import { useState, type ReactNode } from "react";
import { I18nProvider } from "./i18n/context";
import Header from "./components/Header";
import InputPanel from "./components/InputPanel";
import ResultsPanel from "./components/ResultsPanel";
import type { CalculationResult } from "./types";
import "./App.css";

function AppContent(): ReactNode {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="app">
      <div className="app__container">
        <Header />
        <main id="main" aria-label="Car import cost calculator">
          <h1 className="visually-hidden">
            ZustiFasi.ge — Car import cost calculator for Georgia
          </h1>
          <InputPanel
            onResult={setResult}
            onLoading={setIsLoading}
            onError={setError}
          />
          <ResultsPanel
            result={result}
            isLoading={isLoading}
            error={error}
          />
        </main>
      </div>
    </div>
  );
}

export default function App(): ReactNode {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
