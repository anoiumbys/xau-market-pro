import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Locale = 'en' | 'es' | 'id';

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LOCALE_STORAGE_KEY = 'xaupro-locale';

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: 'en',
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: LOCALE_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const selectLocale = (state: LocaleState) => state.locale;
