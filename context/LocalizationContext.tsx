import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Language } from '../types';
import { translations } from '../lib/translations';

type Translator = (key: string, replacements?: { [key: string]: string | number }) => string;

interface LocalizationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translator;
  getLocale: () => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

const getInitialLanguage = (): Language => {
    // Bahasa Indonesia diutamakan sebagai bahasa nomor 1
    return Language.ID;
};

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useLocalStorage<Language>('ukuraga_language', getInitialLanguage());

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t: Translator = useCallback((key: string, replacements?: { [key: string]: string | number }) => {
    let translation = key.split('.').reduce((obj, k) => obj && obj[k], translations[language] as any);
    
    if (typeof translation !== 'string') {
      console.warn(`Translation not found for key: ${key} in language: ${language}`);
      // Fallback ke bahasa lainnya (utamakan Bahasa Indonesia)
      const fallbackLang = language === Language.ID ? Language.EN : Language.ID;
      translation = key.split('.').reduce((obj, k) => obj && obj[k], translations[fallbackLang] as any);
      if (typeof translation !== 'string') {
        return key; // Return the key itself as the ultimate fallback
      }
    }
    
    if (replacements) {
      Object.keys(replacements).forEach(rKey => {
        translation = (translation as string).replace(`{${rKey}}`, String(replacements[rKey]));
      });
    }
    return translation;
  }, [language]);

  const getLocale = useCallback(() => {
    return language === Language.ID ? 'id-ID' : 'en-US';
  }, [language]);

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t, getLocale }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
