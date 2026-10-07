import { useMemo } from 'react';
import { useLocaleStore, selectLocale } from '@stores/localeStore';
import en from '@locales/en.json';
import es from '@locales/es.json';
import id from '@locales/id.json';

const translations = { en, es, id };

export function useTranslation() {
  const locale = useLocaleStore(selectLocale);

  const t = useMemo(() => {
    const dict = translations[locale] || translations.en;
    
    return (key: string, params?: Record<string, string | number>) => {
      const keys = key.split('.');
      let value: unknown = dict;
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = (value as Record<string, unknown>)[k];
        } else {
          return key; // Return key if not found
        }
      }
      
      if (typeof value !== 'string') return key;
      
      // Replace params if provided
      if (params) {
        return Object.entries(params).reduce(
          (str, [param, val]) => str.replace(new RegExp(`\\{${param}\\}`, 'g'), String(val)),
          value
        );
      }
      
      return value;
    };
  }, [locale]);

  return { t, locale };
}