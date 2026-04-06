import { useState, useRef, useEffect, type ReactNode } from "react";
import { useI18n } from "../i18n/context";

interface SearchSelectProps {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  popular?: string[];
  disabled?: boolean;
  onChange: (value: string) => void;
}

export default function SearchSelect({
  label,
  placeholder,
  options,
  value,
  popular = [],
  disabled = false,
  onChange,
}: SearchSelectProps): ReactNode {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = search
    ? options.filter((o) => o.toLowerCase().includes(search.toLowerCase()))
    : options;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleOpen(): void {
    if (disabled) return;
    setIsOpen(true);
    setSearch("");
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function handleSelect(opt: string): void {
    onChange(opt);
    setIsOpen(false);
    setSearch("");
  }

  const displayValue = value || "";

  return (
    <div className="ss" ref={containerRef}>
      <label className="ss__label">{label}</label>
      <button
        type="button"
        className={`ss__trigger ${isOpen ? "ss__trigger--open" : ""} ${disabled ? "ss__trigger--disabled" : ""}`}
        onClick={handleOpen}
      >
        <span className={`ss__trigger-text ${!displayValue ? "ss__trigger-text--placeholder" : ""}`}>
          {displayValue || placeholder}
        </span>
        <svg className={`ss__chevron ${isOpen ? "ss__chevron--up" : ""}`} viewBox="0 0 16 16" fill="currentColor">
          <path d="M4.646 5.646a.5.5 0 01.708 0L8 8.293l2.646-2.647a.5.5 0 01.708.708l-3 3a.5.5 0 01-.708 0l-3-3a.5.5 0 010-.708z" />
        </svg>
      </button>

      {isOpen && (
        <div className="ss__dropdown">
          <div className="ss__search-wrap">
            <svg className="ss__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              className="ss__search"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {!search && popular.length > 0 && (
            <div className="ss__popular">
              <span className="ss__popular-label">{t.popularLabel}</span>
              <div className="ss__popular-tags">
                {popular.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`ss__tag ${value === p ? "ss__tag--active" : ""}`}
                    onClick={() => handleSelect(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="ss__list">
            {filtered.length === 0 ? (
              <div className="ss__empty">{t.noResults}</div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`ss__option ${value === opt ? "ss__option--selected" : ""}`}
                  onClick={() => handleSelect(opt)}
                >
                  <span className={`ss__check ${value === opt ? "ss__check--visible" : ""}`}>
                    <svg viewBox="0 0 16 16" fill="currentColor">
                      <path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z" />
                    </svg>
                  </span>
                  {opt}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
