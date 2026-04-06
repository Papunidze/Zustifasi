import { useState, type ReactNode } from "react";
import { calculateByLink, calculateManual } from "../api";
import { MAKES, getModels, getEngineVolume, detectFuelType } from "../data/cars";
import { useI18n } from "../i18n/context";
import SearchSelect from "./SearchSelect";
import type { CalculationResult } from "../types";

type InputMode = "link" | "manual";
type FuelType = "Gas" | "Hybrid" | "EV";

interface InputPanelProps {
  onResult: (result: CalculationResult) => void;
  onLoading: (loading: boolean) => void;
  onError: (error: string | null) => void;
}

const YEARS: string[] = [];
for (let y = new Date().getFullYear() + 1; y >= 2000; y--) {
  YEARS.push(String(y));
}

const POPULAR_MAKES = ["Toyota", "BMW", "Mercedes", "Hyundai", "Kia", "Tesla", "Lexus", "Honda"];

export default function InputPanel({ onResult, onLoading, onError }: InputPanelProps): ReactNode {
  const { t } = useI18n();

  const [mode, setMode] = useState<InputMode>("link");

  // Link mode state
  const [url, setUrl] = useState("");
  const [linkBudget, setLinkBudget] = useState("");

  // Manual mode state
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [fuelType, setFuelType] = useState<FuelType>("Gas");
  const [engineVolume, setEngineVolume] = useState("");
  const [budget, setBudget] = useState("");

  const isManual = mode === "manual";
  const availableModels = getModels(selectedMake);

  const fuelOptions = [t.fuelGas, t.fuelHybrid, t.fuelEV];
  const fuelToType: Record<string, FuelType> = {
    [t.fuelGas]: "Gas",
    [t.fuelHybrid]: "Hybrid",
    [t.fuelEV]: "EV",
  };
  const typeToFuel: Record<FuelType, string> = {
    Gas: t.fuelGas,
    Hybrid: t.fuelHybrid,
    EV: t.fuelEV,
  };

  function handleMakeChange(make: string): void {
    setSelectedMake(make);
    setSelectedModel("");
    setEngineVolume("");
    setFuelType("Gas");
  }

  function handleModelChange(model: string): void {
    setSelectedModel(model);
    const detectedType = detectFuelType(selectedMake, model);
    setFuelType(detectedType);
    const vol = getEngineVolume(selectedMake, model);
    setEngineVolume(String(vol));
  }

  function handleFuelChange(label: string): void {
    const mapped = fuelToType[label];
    if (mapped) {
      setFuelType(mapped);
      if (mapped === "EV") setEngineVolume("0");
    }
  }

  async function handleLinkSubmit(): Promise<void> {
    if (!url.trim()) {
      onError(t.errNoUrl);
      return;
    }
    const parsedBudget = Number(linkBudget) || 0;

    onError(null);
    onLoading(true);
    try {
      const res = await calculateByLink({
        url: url.trim(),
        budgetUSD: parsedBudget > 0 ? parsedBudget : 0,
      });
      if (res.data) onResult(res.data);
    } catch (err) {
      onError(err instanceof Error ? err.message : t.errGeneric);
    } finally {
      onLoading(false);
    }
  }

  async function handleManualSubmit(): Promise<void> {
    if (!selectedMake || !selectedModel) {
      onError(t.errNoMakeModel);
      return;
    }
    if (!selectedYear) {
      onError(t.errNoYear);
      return;
    }
    const vol = Number(engineVolume);
    if (fuelType !== "EV" && (!vol || vol <= 0)) {
      onError(t.errNoEngine);
      return;
    }
    const parsedBudget = Number(budget) || 0;

    onError(null);
    onLoading(true);
    try {
      const res = await calculateManual({
        make: selectedMake,
        model: selectedModel,
        year: Number(selectedYear),
        engineVolume: fuelType === "EV" ? 0 : vol,
        type: fuelType,
        budgetUSD: parsedBudget > 0 ? parsedBudget : 0,
      });
      if (res.data) onResult(res.data);
    } catch (err) {
      onError(err instanceof Error ? err.message : t.errGeneric);
    } finally {
      onLoading(false);
    }
  }

  return (
    <div className="input-panel">
      {/* Mode Toggle */}
      <div className="input-panel__tabs">
        <button
          className={`input-panel__tab ${!isManual ? "input-panel__tab--active" : ""}`}
          onClick={() => setMode("link")}
        >
          {t.tabLink}
        </button>
        <button
          className={`input-panel__tab ${isManual ? "input-panel__tab--active" : ""}`}
          onClick={() => setMode("manual")}
        >
          {t.tabFilters}
        </button>
      </div>

      {isManual ? (
        <div className="input-panel__form">
          <div className="filter-grid">
            <SearchSelect
              label={t.makeLabel}
              placeholder={t.makePlaceholder}
              options={MAKES}
              value={selectedMake}
              popular={POPULAR_MAKES}
              onChange={handleMakeChange}
            />
            <SearchSelect
              label={t.modelLabel}
              placeholder={t.modelPlaceholder}
              options={availableModels}
              value={selectedModel}
              disabled={availableModels.length === 0}
              onChange={handleModelChange}
            />
            <SearchSelect
              label={t.yearLabel}
              placeholder={t.yearPlaceholder}
              options={YEARS}
              value={selectedYear}
              onChange={setSelectedYear}
            />
            <SearchSelect
              label={t.fuelLabel}
              placeholder={t.fuelPlaceholder}
              options={fuelOptions}
              value={typeToFuel[fuelType]}
              onChange={handleFuelChange}
            />
            <div className="filter-grid__item">
              <label className="filter-grid__label">{t.engineLabel}</label>
              <input
                type="number"
                className="filter-grid__input"
                placeholder={t.enginePlaceholder}
                step="0.1"
                value={fuelType === "EV" ? "0" : engineVolume}
                disabled={fuelType === "EV"}
                onChange={(e) => setEngineVolume(e.target.value)}
              />
            </div>
            <div className="filter-grid__item">
              <label className="filter-grid__label">{t.priceLabel}</label>
              <input
                type="number"
                className="filter-grid__input"
                placeholder={t.pricePlaceholder}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
          </div>

          <button className="input-panel__submit" onClick={handleManualSubmit}>
            {t.calculate}
          </button>
        </div>
      ) : (
        <div className="input-panel__form">
          <div className="filter-grid filter-grid--link">
            <div className="filter-grid__item filter-grid__item--wide">
              <label className="filter-grid__label">{t.linkLabel}</label>
              <input
                type="text"
                className="filter-grid__input"
                placeholder={t.linkPlaceholder}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div className="filter-grid__item">
              <label className="filter-grid__label">{t.priceLabel}</label>
              <input
                type="number"
                className="filter-grid__input"
                placeholder={t.pricePlaceholder}
                value={linkBudget}
                onChange={(e) => setLinkBudget(e.target.value)}
              />
            </div>
          </div>

          <button className="input-panel__submit" onClick={handleLinkSubmit}>
            {t.calculate}
          </button>
        </div>
      )}
    </div>
  );
}
