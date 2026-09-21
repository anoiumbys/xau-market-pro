import { useUIStore, selectSidebarOpen, selectMobileMenuOpen, selectTheme, selectToasts } from '@stores/uiStore';

export function useSidebarOpen() {
  return useUIStore(selectSidebarOpen);
}

export function useMobileMenuOpen() {
  return useUIStore(selectMobileMenuOpen);
}

export function useTheme() {
  return useUIStore(selectTheme);
}

export function useToasts() {
  return useUIStore(selectToasts);
}

export function useUIActions() {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);
  const toggleMobileMenu = useUIStore((state) => state.toggleMobileMenu);
  const setMobileMenuOpen = useUIStore((state) => state.setMobileMenuOpen);
  const setTheme = useUIStore((state) => state.setTheme);
  const addToast = useUIStore((state) => state.addToast);
  const removeToast = useUIStore((state) => state.removeToast);

  return { toggleSidebar, setSidebarOpen, toggleMobileMenu, setMobileMenuOpen, setTheme, addToast, removeToast };
}