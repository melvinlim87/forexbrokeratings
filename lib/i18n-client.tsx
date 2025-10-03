'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type Messages = Record<string, string>;

type I18nContextType = {
  locale: 'en' | 'zh';
  messages: Messages;
  t: (key: string) => string;
  setLocale: (locale: 'en' | 'zh') => void;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Static imports so bundlers include them
import enMessages from '@/messages/en.json';
import zhMessages from '@/messages/zh.json';

const ALL_MESSAGES: Record<'en' | 'zh', Messages> = {
  en: enMessages as Messages,
  zh: zhMessages as Messages,
};

function readInitialLocale(): 'en' | 'zh' {
  if (typeof window === 'undefined') return 'en';
  // 1) cookie
  const cookieMatch = document.cookie.match(/(?:^|; )locale=([^;]+)/);
  if (cookieMatch) {
    const v = decodeURIComponent(cookieMatch[1]);
    if (v === 'en' || v === 'zh') return v;
  }
  // 2) localStorage
  try {
    const ls = localStorage.getItem('locale');
    if (ls === 'en' || ls === 'zh') return ls;
  } catch {}
  // 3) browser language
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith('zh')) return 'zh';
  return 'en';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<'en' | 'zh'>(readInitialLocale());

  useEffect(() => {
    try {
      localStorage.setItem('locale', locale);
    } catch {}
    document.cookie = `locale=${encodeURIComponent(locale)}; path=/; max-age=${60 * 60 * 24 * 365}`;
  }, [locale]);

  const setLocale = useCallback((l: 'en' | 'zh') => {
    setLocaleState(l);
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const search = window.location.search || '';
      const hash = window.location.hash || '';
      const basePath = (path.replace(/^\/(en|zh)(?=\/|$)/, '')) || '/';
      const target = `/${l}${basePath}${search}${hash}`;
      if (`${path}${search}${hash}` !== target) {
        window.location.assign(target);
      }
    }
  }, []);

  const messages = useMemo(() => ALL_MESSAGES[locale] || enMessages, [locale]);

  const t = useCallback(
    (key: string) => {
      if (messages && Object.prototype.hasOwnProperty.call(messages, key)) return messages[key];
      // fallback to EN if not present
      const fallback = (ALL_MESSAGES['en'] || {})[key];
      return fallback || key;
    },
    [messages]
  );

  const value = useMemo<I18nContextType>(() => ({ locale, messages, t, setLocale }), [locale, messages, t, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
