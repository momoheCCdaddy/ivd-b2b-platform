"use client";
import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

export type Lang = "en" | "zh" | "ar" | "de" | "fr" | "es" | "id" | "th" | "vi";
export type Currency = "USD" | "EUR" | "CNY";

export const LANGUAGES: Array<{ code: Lang; label: string; shortLabel: string; htmlLang: string; dir: "ltr" | "rtl" }> = [
  { code: "en", label: "English", shortLabel: "EN", htmlLang: "en", dir: "ltr" },
  { code: "zh", label: "中文", shortLabel: "中文", htmlLang: "zh-CN", dir: "ltr" },
  { code: "de", label: "Deutsch", shortLabel: "DE", htmlLang: "de", dir: "ltr" },
  { code: "fr", label: "Français", shortLabel: "FR", htmlLang: "fr", dir: "ltr" },
  { code: "es", label: "Español", shortLabel: "ES", htmlLang: "es", dir: "ltr" },
  { code: "id", label: "Bahasa Indonesia", shortLabel: "ID", htmlLang: "id", dir: "ltr" },
  { code: "th", label: "ไทย", shortLabel: "ไทย", htmlLang: "th", dir: "ltr" },
  { code: "vi", label: "Tiếng Việt", shortLabel: "VI", htmlLang: "vi", dir: "ltr" },
  { code: "ar", label: "العربية", shortLabel: "AR", htmlLang: "ar", dir: "rtl" },
];

interface I18nContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  setLang: () => {},
  currency: "USD",
  setCurrency: () => {},
  t: (k: string) => k,
});

import enMsgs from "../../messages/en.json";
import zhMsgs from "../../messages/zh.json";
import arMsgs from "../../messages/ar.json";
import deMsgs from "../../messages/de.json";
import frMsgs from "../../messages/fr.json";
import esMsgs from "../../messages/es.json";
import idMsgs from "../../messages/id.json";
import thMsgs from "../../messages/th.json";
import viMsgs from "../../messages/vi.json";
import salesMsgs from "../../messages/sales.json";

const MESSAGES: Record<string, Record<string, string>> = {
  en: { ...enMsgs, ...salesMsgs.en } as Record<string, string>,
  zh: { ...zhMsgs, ...salesMsgs.zh } as Record<string, string>,
  ar: { ...arMsgs, ...salesMsgs.ar } as Record<string, string>,
  de: { ...deMsgs, ...salesMsgs.de } as Record<string, string>,
  fr: { ...frMsgs, ...salesMsgs.fr } as Record<string, string>,
  es: { ...esMsgs, ...salesMsgs.es } as Record<string, string>,
  id: { ...idMsgs, ...salesMsgs.id } as Record<string, string>,
  th: { ...thMsgs, ...salesMsgs.th } as Record<string, string>,
  vi: { ...viMsgs, ...salesMsgs.vi } as Record<string, string>,
};

const isSupportedLang = (value: string | null): value is Lang => LANGUAGES.some(language => language.code === value);
const applyDocumentLocale = (lang: Lang) => {
  const language = LANGUAGES.find(item => item.code === lang) || LANGUAGES[0];
  document.documentElement.lang = language.htmlLang;
  document.documentElement.dir = language.dir;
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [currency, setCurrencyState] = useState<Currency>("USD");

  useEffect(() => {
    const saved = localStorage.getItem("biosci_lang") as Lang | null;
    if (isSupportedLang(saved)) {
      setLangState(saved);
      applyDocumentLocale(saved);
    } else {
      const browserLanguage = navigator.language.toLowerCase().split("-")[0];
      const detected: Lang = isSupportedLang(browserLanguage) ? browserLanguage : "en";
      setLangState(detected);
      applyDocumentLocale(detected);
    }
    const savedCurrency = localStorage.getItem("cobioer_currency") as Currency | null;
    if (savedCurrency && ["USD", "EUR", "CNY"].includes(savedCurrency)) setCurrencyState(savedCurrency);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("biosci_lang", l);
    applyDocumentLocale(l);
  }, []);

  const setCurrency = useCallback((next: Currency) => {
    setCurrencyState(next);
    localStorage.setItem("cobioer_currency", next);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      try {
        let text = MESSAGES[lang]?.[key] ?? MESSAGES.en?.[key] ?? key;
        if (params) {
          Object.entries(params).forEach(([k, v]) => {
            text = text.replace(`{${k}}`, String(v));
          });
        }
        return text;
      } catch {
        return key;
      }
    },
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, currency, setCurrency, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
