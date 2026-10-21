import { useEffect } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import useAuthStore, { selectUser } from '@stores/authStore';
import { useUIStore, selectSidebarOpen, selectMobileMenuOpen } from '@stores/uiStore';
import { useIsMobile } from '@hooks/useIsMobile';
import {
  LayoutDashboard,
  Users,
  Globe,
  CreditCard,
  Bell,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  User,
  Shield,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '@utils/cn';

const ADMIN_NAV_ITEMS = [
  { path: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/markets', label: 'Markets', icon: Globe },
  { path: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { path: '/admin/alerts', label: 'Alerts', icon: Bell },
  { path: '/admin/journal', label: 'Trade Journal', icon: BookOpen },
  { path: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
] as const;

export function AdminLayout() {
  const location = useLocation();
  const user = useAuthStore(selectUser);
  const sidebarOpen = useUIStore(selectSidebarOpen);
  const mobileMenuOpen = useUIStore(selectMobileMenuOpen);
  const isMobile = useIsMobile();

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

  return (
    <div className="app-ambient flex min-h-screen bg-light-50 dark:bg-dark-950">
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => useUIStore.getState().setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'z-50 flex h-screen w-64 shrink-0 flex-col border-r border-gold-500/20 bg-light-100/85 backdrop-blur-xl transition-[margin,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] dark:border-gold-500/15 dark:bg-dark-900/85',
          'fixed inset-y-0 left-0',
          isMobile
            ? mobileMenuOpen
              ? 'translate-x-0 shadow-2xl'
              : '-translate-x-full'
            : 'sticky top-0 translate-x-0',
          !isMobile && !sidebarOpen && 'lg:-ml-64'
        )}
        aria-label="Admin navigation"
        aria-hidden={!isMobile && !sidebarOpen}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-gold-500/20 px-4 dark:border-gold-500/15">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5" aria-label="Admin home">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-yellow-600 shadow-lg shadow-gold-500/30">
              <Shield className="h-5 w-5 text-dark-950" aria-hidden="true" />
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-bold text-light-900 dark:text-white">
                Admin
              </span>
              <span className="block text-[11px] font-medium text-gold-600 dark:text-gold-400">
                Control Center
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

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" role="navigation">
          <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-light-500 dark:text-dark-500">
            Manage
          </p>
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'group relative flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'border border-gold-500/40 bg-gold-500/15 text-gold-700 shadow-[0_0_20px_rgba(245,158,11,0.15)] dark:text-gold-300'
                      : 'border border-transparent text-light-700 hover:bg-gold-500/10 hover:text-light-900 dark:text-dark-300 dark:hover:bg-gold-500/10 dark:hover:text-gold-200'
                  )
                }
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
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold-500/15">
                      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    {item.label}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="shrink-0 space-y-2 border-t border-gold-500/20 p-3 dark:border-gold-500/15">
          <Link
            to="/dashboard"
            className="btn-secondary btn-sm w-full justify-center gap-2"
            onClick={() => isMobile && useUIStore.getState().setMobileMenuOpen(false)}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to App
          </Link>
          <div className="flex items-center gap-3 rounded-xl bg-light-200/60 px-3 py-2.5 dark:bg-white/[0.04]">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-yellow-600 font-bold text-dark-950">
              {user?.name?.charAt(0).toUpperCase() ?? <User className="h-4 w-4" aria-hidden="true" />}
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-sm font-semibold text-light-900 dark:text-white">
                {user?.name}
              </span>
              <span className="block truncate text-xs text-gold-500 dark:text-gold-400">
                Administrator
              </span>
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary btn-sm w-full justify-start gap-2"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-gold-500/20 bg-light-100/75 px-4 backdrop-blur-xl dark:border-gold-500/15 dark:bg-dark-950/70 lg:px-6">
          <div className="flex items-center gap-2">
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
            <h1 className="text-[15px] font-bold text-light-900 dark:text-white">
              {location.pathname.split('/').pop()?.replace(/-/g, ' ') ?? 'Admin'}
            </h1>
          </div>

          <span className="hidden items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/15 px-3.5 py-1.5 text-xs font-semibold text-gold-600 dark:text-gold-300 sm:flex">
            <Shield className="h-3.5 w-3.5" aria-hidden="true" />
            Admin Panel
          </span>
        </header>

        <div className="flex-1 p-4 lg:p-6">
          <div key={location.pathname} className="page-enter mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
