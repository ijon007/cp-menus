"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Language, menuTranslations, MenuTranslations, translateText } from "./i18n";

const STORAGE_KEY = "liveMenuLanguage";

interface UseLanguageResult {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: MenuTranslations;
  hydrated: boolean;
  translate: (text: string) => string;
}

const LanguageContext = createContext<UseLanguageResult | null>(null);

function useLanguageState(): UseLanguageResult {
  const [language, setLanguageState] = useState<Language>("en");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "sq" || stored === "it") {
        setLanguageState(stored as Language);
      } else if (typeof navigator !== "undefined" && navigator.language) {
        const lang = navigator.language.toLowerCase();
        if (lang.startsWith("sq")) {
          setLanguageState("sq");
        } else if (lang.startsWith("it")) {
          setLanguageState("it");
        }
      }
    } catch {
      // ignore storage errors
    } finally {
      setHydrated(true);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore storage errors
    }
  };

  const t = menuTranslations[language];
  const translate = (text: string) => translateText(language, text);

  return { language, setLanguage, t, hydrated, translate };
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const value = useLanguageState();
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): UseLanguageResult {
  const ctx = useContext(LanguageContext);
  if (ctx) return ctx;
  return useLanguageState();
}

