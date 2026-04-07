import { createContext, useContext, useState, type ReactNode } from "react";
import { translations, type Lang, type Translations } from "./translations";

interface I18nContextValue {
  lang: Lang;
  t: Translations;
  setLang: (lang: Lang) => void;
}

const I18nContext = createContext<I18nContextValue>({
  lang: "ge",
  t: translations.ge,
  setLang: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }): ReactNode {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem("lang");
    if (saved === "en" || saved === "ru" || saved === "ge") return saved;
    return "ge";
  });

  function setLang(newLang: Lang): void {
    setLangState(newLang);
    localStorage.setItem("lang", newLang);
  }

  return (
    <I18nContext.Provider value={{ lang, t: translations[lang], setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n(): I18nContextValue {
  return useContext(I18nContext);
}
