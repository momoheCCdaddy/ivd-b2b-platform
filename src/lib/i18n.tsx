"use client";
import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

export type Lang = "en" | "zh" | "ar";
export type Currency = "USD" | "EUR" | "CNY";

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

const MESSAGES: Record<string, Record<string, string>> = {
  en: enMsgs as Record<string, string>,
  zh: zhMsgs as Record<string, string>,
  ar: arMsgs as Record<string, string>,
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [currency, setCurrencyState] = useState<Currency>("USD");

  useEffect(() => {
    const saved = localStorage.getItem("biosci_lang") as Lang | null;
    if (saved && (saved === "en" || saved === "zh" || saved === "ar")) {
      setLangState(saved);
      document.documentElement.lang = saved === "zh" ? "zh-CN" : saved;
      document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
    } else {
      const detected: Lang = navigator.language.toLowerCase().startsWith("zh") ? "zh" : navigator.language.toLowerCase().startsWith("ar") ? "ar" : "en";
      setLangState(detected);
      document.documentElement.lang = detected === "zh" ? "zh-CN" : detected;
      document.documentElement.dir = detected === "ar" ? "rtl" : "ltr";
    }
    const savedCurrency = localStorage.getItem("cobioer_currency") as Currency | null;
    if (savedCurrency && ["USD", "EUR", "CNY"].includes(savedCurrency)) setCurrencyState(savedCurrency);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("biosci_lang", l);
    document.documentElement.lang = l === "zh" ? "zh-CN" : l;
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
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
