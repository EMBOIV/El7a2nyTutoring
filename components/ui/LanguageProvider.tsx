'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Lang, TranslationKeys } from '@/lib/i18n';
import { LANG_STORAGE_KEY, getTranslations } from '@/lib/i18n';

interface LanguageContextValue {
  lang: Lang;
  t: TranslationKeys;
  setLang: (lang: Lang) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const stored = localStorage.getItem(LANG_STORAGE_KEY) as Lang | null;
    if (stored === 'ar' || stored === 'en') {
      setLangState(stored);
    }
  }, []);

  useEffect(() => {
    const isRTL = lang === 'ar';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
  }, [lang]);

  const setLang = (newLang: Lang) => {
    localStorage.setItem(LANG_STORAGE_KEY, newLang);
    setLangState(newLang);
  };

  const t = getTranslations(lang);
  const isRTL = lang === 'ar';

  return (
    <LanguageContext.Provider value={{ lang, t, setLang, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider');
  return ctx;
}
