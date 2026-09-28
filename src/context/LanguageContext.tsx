"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { copy, LOCALE_COOKIE, StoreLocale } from "../lib/locale";

type LanguageContextValue = {
  locale: StoreLocale;
  setLocale: (locale: StoreLocale) => void;
  t: (id: string, en: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children, initialLocale }: { children: React.ReactNode; initialLocale: StoreLocale }) {
  const router = useRouter();
  const [locale, updateLocale] = useState(initialLocale);

  useEffect(() => {
    updateLocale(initialLocale);
    document.documentElement.lang = initialLocale;
  }, [initialLocale]);

  const setLocale = (next: StoreLocale) => {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    document.documentElement.lang = next;
    updateLocale(next);
    router.refresh();
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: (id, en) => copy(locale, id, en) }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
