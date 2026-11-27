import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useUIStore } from './uiStore';

describe('uiStore', () => {
  beforeEach(() => {
    useUIStore.setState({ sidebarOpen: true, mobileMenuOpen: false, toasts: [] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('toggleSidebar membalik status sidebar', () => {
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarOpen).toBe(false);

    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarOpen).toBe(true);
  });

  it('setMobileMenuOpen mengatur menu mobile', () => {
    useUIStore.getState().setMobileMenuOpen(true);
    expect(useUIStore.getState().mobileMenuOpen).toBe(true);
  });

  it('addToast menambah toast dan removeToast menghapusnya', () => {
    useUIStore.getState().addToast('Berhasil disimpan', 'success');

    const [toast] = useUIStore.getState().toasts;
    expect(toast.message).toBe('Berhasil disimpan');
    expect(toast.type).toBe('success');

    useUIStore.getState().removeToast(toast.id);
    expect(useUIStore.getState().toasts).toHaveLength(0);
  });

  it('toast hilang otomatis setelah 5 detik', () => {
    vi.useFakeTimers();

    useUIStore.getState().addToast('Halo');
    expect(useUIStore.getState().toasts).toHaveLength(1);

    vi.advanceTimersByTime(5000);
    expect(useUIStore.getState().toasts).toHaveLength(0);
  });

  it('setTheme mengatur tema dan class dark pada <html>', () => {
    useUIStore.getState().setTheme('dark');
    expect(useUIStore.getState().theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    useUIStore.getState().setTheme('light');
    expect(useUIStore.getState().resolvedTheme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
