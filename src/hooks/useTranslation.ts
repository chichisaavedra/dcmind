import { useState, useEffect } from 'react';
import { translations, TranslationKey } from '../lib/translations';

// Detects language synchronously (no flash of wrong language on first render)
function detectLang(): 'es' | 'en' {
  const nav = navigator.language || (navigator as any).userLanguage || 'en';
  return nav.toLowerCase().startsWith('es') ? 'es' : 'en';
}

export function useTranslation() {
  // Initialize directly from navigator — no useEffect delay needed
  const [lang, setLang] = useState<'es' | 'en'>(detectLang);

  // Re-check if the user changes their browser language while the tab is open
  useEffect(() => {
    const handleLanguageChange = () => setLang(detectLang());
    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  const t = (key: TranslationKey): string => {
    return translations[lang][key] || translations['en'][key] || key;
  };

  return { t, lang };
}
