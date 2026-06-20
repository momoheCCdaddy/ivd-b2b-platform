"use client";
import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

type Lang = "en" | "zh";

interface I18nContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType>({
  lang: "zh",
  setLang: () => {},
  t: (k: string) => k,
});

import enMsgs from "../../messages/en.json";
import zhMsgs from "../../messages/zh.json";

const MESSAGES: Record<string, Record<string, string>> = {
  en: enMsgs as Record<string, string>,
  zh: zhMsgs as Record<string, string>,
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("zh");

  useEffect(() => {
    const saved = localStorage.getItem("biosci_lang") as Lang | null;
    if (saved && (saved === "en" || saved === "zh")) {
      setLangState(saved);
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("biosci_lang", l);
    document.documentElement.lang = l === "en" ? "en" : "zh-CN";
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      try {
        let text = MESSAGES[lang]?.[key] ?? key;
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
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
