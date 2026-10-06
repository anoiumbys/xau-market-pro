import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface UIState {
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  toasts: Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  setTheme: (theme: Theme) => void;
  initializeTheme: () => void;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const THEME_STORAGE_KEY = 'xaupro-theme';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  
  const resolved = theme === 'system' ? getSystemTheme() : theme;
  document.documentElement.classList.toggle('dark', resolved === 'dark');
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarOpen: true,
      mobileMenuOpen: false,
      theme: 'system',
      resolvedTheme: 'dark',
      toasts: [],

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      
      setTheme: (theme) => {
        applyTheme(theme);
        const resolved = theme === 'system' ? getSystemTheme() : theme;
        set({ theme, resolvedTheme: resolved });
      },

      initializeTheme: () => {
        const stored = get().theme;
        applyTheme(stored);
        const resolved = stored === 'system' ? getSystemTheme() : stored;
        set({ resolvedTheme: resolved });

        // Listen for system theme changes
        if (typeof window !== 'undefined') {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          const handler = (e: MediaQueryListEvent) => {
            const currentTheme = get().theme;
            if (currentTheme === 'system') {
              const resolved = e.matches ? 'dark' : 'light';
              document.documentElement.classList.toggle('dark', e.matches);
              set({ resolvedTheme: resolved });
            }
          };
          mediaQuery.addEventListener('change', handler);
          // Store cleanup function in window for potential cleanup
          (window as any).__themeCleanup = () => mediaQuery.removeEventListener('change', handler);
        }
      },

      addToast: (message, type = 'info') => {
        const id = Math.random().toString(36).slice(2, 9);
        set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
        setTimeout(() => {
          set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
        }, 5000);
      },
      removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: THEME_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.initializeTheme();
        }
      },
    }
  )
);

export const selectSidebarOpen = (state: UIState) => state.sidebarOpen;
export const selectMobileMenuOpen = (state: UIState) => state.mobileMenuOpen;
export const selectTheme = (state: UIState) => state.theme;
export const selectResolvedTheme = (state: UIState) => state.resolvedTheme;
export const selectToasts = (state: UIState) => state.toasts;