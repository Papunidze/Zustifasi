import type { ReactNode } from "react";
import { useI18n } from "../i18n/context";
import type { Lang } from "../i18n/translations";
import logoSvg from "../assets/logo.svg";

const LANGS: { code: Lang; label: string }[] = [
  { code: "ge", label: "GE" },
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
];

export default function Header(): ReactNode {
  const { lang, setLang } = useI18n();

  return (
    <header className="header">
      <div className="header__logo">
        <img className="header__logo-icon" src={logoSvg} alt="Zustad.ge" />
        <span className="header__logo-text">Zustad.ge</span>
      </div>
      <div className="header__lang">
        {LANGS.map((l) => (
          <button
            key={l.code}
            className={`header__lang-btn ${lang === l.code ? "header__lang-btn--active" : ""}`}
            onClick={() => setLang(l.code)}
          >
            {l.label}
          </button>
        ))}
      </div>
    </header>
  );
}
