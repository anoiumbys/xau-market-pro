import { useEffect } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import useAuthStore, { selectUser } from '@stores/authStore';
import { useUIStore, selectSidebarOpen, selectMobileMenuOpen } from '@stores/uiStore';
import { useMarketStore, selectCurrentMarket } from '@stores/marketStore';
import { useIsMobile } from '@hooks/useIsMobile';
import { useTranslation } from '@hooks/useTranslation';
import {
  LayoutDashboard,
  BookOpen,
  Bell,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  User,
  Shield,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { cn, formatPrice } from '@utils/cn';

const NAV_ITEMS = [
  { path: '/dashboard', labelKey: 'navigation.dashboard', icon: LayoutDashboard, section: 'Menu' },
  { path: '/chart', labelKey: 'navigation.chart', icon: BarChart3, section: 'Menu' },
  { path: '/journal', labelKey: 'navigation.journal', icon: BookOpen, section: 'Menu' },
  { path: '/alerts', labelKey: 'navigation.alerts', icon: Bell, section: 'Menu' },
  { path: '/subscription', labelKey: 'navigation.subscription', icon: CreditCard, section: 'Menu' },
  { path: '/reports', labelKey: 'navigation.reports', icon: BarChart3, section: 'Menu' },
  { path: '/settings', labelKey: 'navigation.settings', icon: Settings, section: 'System' },
] as const;

const PAGE_TITLES: Record<string, { title: string; sub: string }> = {
  '/dashboard': { title: 'Dashboard', sub: 'Trading overview' },
  '/chart': { title: 'Chart', sub: 'XAUUSD real-time' },
  '/journal': { title: 'Journal', sub: 'Trade records' },
  '/journal/new': { title: 'New Trade', sub: 'Record a trade' },
  '/alerts': { title: 'Alerts', sub: 'Price notifications' },
  '/subscription': { title: 'Subscription', sub: 'Plan & billing' },
  '/reports': { title: 'Reports', sub: 'Performance analytics' },
  '/settings': { title: 'Settings', sub: 'Preferences' },
};

function navItemClass(isActive: boolean) {
  return cn(
    'group relative flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
    isActive
      ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/25'
      : 'text-light-700 hover:bg-light-200 hover:text-light-900 dark:text-dark-300 dark:hover:bg-white/[0.06] dark:hover:text-white'
  );
}

export function Layout() {
  const location = useLocation();
  const { t } = useTranslation();
  const user = useAuthStore(selectUser);
  const sidebarOpen = useUIStore(selectSidebarOpen);
  const mobileMenuOpen = useUIStore(selectMobileMenuOpen);
  const isMobile = useIsMobile();

  const currentMarket = useMarketStore(selectCurrentMarket);
  const fetchMarket = useMarketStore((state) => state.fetchMarket);

  useEffect(() => {
    fetchMarket('XAUUSD');
    const t = setInterval(() => fetchMarket('XAUUSD'), 30000);
    return () => clearInterval(t);
  }, [fetchMarket]);

  // Close drawer on Escape (mobile)
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') useUIStore.getState().setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    await useAuthStore.getState().logout();
  };

  const page = PAGE_TITLES[location.pathname] ?? { title: 'XAU Pro', sub: '' };
  const spot = currentMarket?.spot_price ?? null;
  const chg = currentMarket?.change_24h ?? 0;
  const up = chg >= 0;

  let lastSection = '';

  return (
    <div className="app-ambient flex min-h-screen bg-light-50 dark:bg-dark-950">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => useUIStore.getState().setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar — in flex flow on desktop so collapse gives fullscreen content */}
      <aside
        className={cn(
          'z-50 flex h-screen w-64 shrink-0 flex-col border-r border-light-200/70 bg-light-100/85 backdrop-blur-xl transition-[margin,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] dark:border-white/[0.07] dark:bg-dark-900/85',
          // mobile: drawer
          isMobile
            ? mobileMenuOpen
              ? 'fixed inset-y-0 left-0 translate-x-0 shadow-2xl'
              : 'fixed inset-y-0 left-0 -translate-x-full'
            : 'sticky top-0 translate-x-0',
          // desktop collapse: slide out of flow → content goes fullscreen
          !isMobile && !sidebarOpen && 'lg:-ml-64'
        )}
        aria-label="Main navigation"
        aria-hidden={!isMobile && !sidebarOpen}
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-light-200/70 px-4 dark:border-white/[0.07]">
          <Link to="/dashboard" className="flex items-center gap-2.5" aria-label="XAU Pro home">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-gold-500 text-[11px] font-black tracking-tight text-white shadow-lg shadow-primary-500/30">
              XAU
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-bold text-light-900 dark:text-white">
                XAU Pro
              </span>
              <span className="block text-[11px] font-medium text-gold-600 dark:text-gold-400">
                Market Terminal
              </span>
            </span>
          </Link>
          {isMobile && (
            <button
              onClick={() => useUIStore.getState().setMobileMenuOpen(false)}
              className="btn-ghost btn-sm btn-icon lg:hidden"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" role="navigation">
          {NAV_ITEMS.map((item) => {
            const showSection = item.section !== lastSection;
            lastSection = item.section;
            const Icon = item.icon;
            return (
              <div key={item.path}>
                {showSection && (
                  <p className="px-3 pb-1.5 pt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-light-500 first:pt-0 dark:text-dark-500">
                    {item.section}
                  </p>
                )}
                <NavLink
                  to={item.path}
                  end={item.path === '/dashboard' || item.path === '/journal'}
                  className={({ isActive }) => navItemClass(isActive)}
                  onClick={() => isMobile && useUIStore.getState().setMobileMenuOpen(false)}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span
                          className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gold-400 shadow-[0_0_12px_rgba(245,158,11,0.9)]"
                          aria-hidden="true"
                        />
                      )}
                      <span
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                          isActive
                            ? 'bg-white/20'
                            : 'bg-light-200 text-light-600 group-hover:bg-light-300 dark:bg-white/[0.06] dark:text-dark-300'
                        )}
                      >
                        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                      </span>
                      {t(item.labelKey)}
                    </>
                  )}
                </NavLink>
              </div>
            );
          })}

          {user?.role === 'admin' && (
            <>
              <p className="px-3 pb-1.5 pt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-light-500 dark:text-dark-500">
                Admin
              </p>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  cn(
                    'group relative flex min-h-[44px] items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'border-gold-500/40 bg-gold-500/15 text-gold-600 shadow-[0_0_20px_rgba(245,158,11,0.15)] dark:text-gold-300'
                      : 'border-gold-500/20 text-light-700 hover:bg-gold-500/10 dark:text-dark-300 dark:hover:bg-gold-500/10 dark:hover:text-gold-200'
                  )
                }
                onClick={() => isMobile && useUIStore.getState().setMobileMenuOpen(false)}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold-500/15">
                  <Shield className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
                {t('navigation.admin')}
              </NavLink>
            </>
          )}
        </nav>

        {/* User section */}
        <div className="shrink-0 border-t border-light-200/70 p-3 dark:border-white/[0.07]">
          <div className="flex items-center gap-3 rounded-xl bg-light-200/60 px-3 py-2.5 dark:bg-white/[0.04]">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-gold-500 font-bold text-white">
              {user?.name?.charAt(0).toUpperCase() ?? (
                <User className="h-4 w-4" aria-hidden="true" />
              )}
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-sm font-semibold text-light-900 dark:text-white">
                {user?.name}
              </span>
              <span className="block truncate text-xs capitalize text-light-500 dark:text-dark-400">
                {user?.role}
              </span>
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary btn-sm mt-2 w-full justify-start gap-2"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex min-h-screen min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-light-200/70 bg-light-100/75 px-4 backdrop-blur-xl dark:border-white/[0.07] dark:bg-dark-950/70 lg:px-6">
          <div className="flex min-w-0 items-center gap-2">
            {isMobile ? (
              <button
                onClick={() => useUIStore.getState().setMobileMenuOpen(true)}
                className="btn-ghost btn-icon"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
            ) : (
              <button
                onClick={() => useUIStore.getState().toggleSidebar()}
                className="btn-ghost btn-icon"
                aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                title={sidebarOpen ? 'Sembunyikan navigasi (fullscreen)' : 'Tampilkan navigasi'}
              >
                {sidebarOpen ? (
                  <PanelLeftClose className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <PanelLeftOpen className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            )}
            <div className="min-w-0 leading-tight">
              <h1 className="truncate text-[15px] font-bold text-light-900 dark:text-white">
                {page.title}
              </h1>
              {page.sub && (
                <p className="hidden truncate text-xs text-light-500 dark:text-dark-400 sm:block">
                  {page.sub}
                </p>
              )}
            </div>
          </div>

          {/* Live ticker */}
          <Link
            to="/chart"
            className="flex items-center gap-2 rounded-full border border-gold-500/25 bg-gold-500/[0.08] py-1.5 pl-3 pr-3.5 transition-colors hover:bg-gold-500/[0.15]"
            aria-label="XAUUSD live price, open chart"
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
            <span className="font-mono text-xs font-bold tracking-wide text-gold-500 dark:text-gold-400">
              XAUUSD
            </span>
            <span className="font-mono text-sm font-bold tabular-nums text-light-900 dark:text-white">
              {spot != null ? formatPrice(spot) : '—'}
            </span>
            <span
              className={cn(
                'hidden items-center gap-0.5 font-mono text-xs tabular-nums sm:flex',
                up ? 'text-green-400' : 'text-red-400'
              )}
            >
              {up ? (
                <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {up ? '+' : ''}
              {formatPrice(chg)}
            </span>
          </Link>
        </header>

        {/* Page content */}
        <div className="flex-1 p-4 lg:p-6">
          <div key={location.pathname} className="page-enter mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
