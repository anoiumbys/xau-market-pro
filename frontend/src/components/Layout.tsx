import { ReactNode } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import useAuthStore, { selectUser } from '@stores/authStore';
import { useUIStore, selectSidebarOpen, selectMobileMenuOpen } from '@stores/uiStore';
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
  ChevronLeft,
  User,
  Shield,
} from 'lucide-react';
import { cn } from '@utils/cn';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/chart', label: 'Chart', icon: BarChart3 },
  { path: '/journal', label: 'Journal', icon: BookOpen },
  { path: '/alerts', label: 'Alerts', icon: Bell },
  { path: '/subscription', label: 'Subscription', icon: CreditCard },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
] as const;

export function Layout() {
  const location = useLocation();
  const user = useAuthStore(selectUser);
  const sidebarOpen = useUIStore(selectSidebarOpen);
  const mobileMenuOpen = useUIStore(selectMobileMenuOpen);
  const { setMobileMenuOpen, toggleSidebar } = useUIStore();

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  const handleLogout = async () => {
    await useAuthStore.getState().logout();
  };

  return (
    <div className="flex min-h-screen bg-light-50 dark:bg-dark-950">
      {/* Mobile overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed z-50 flex h-full w-64 flex-col border-r border-light-200 bg-light-100/80 backdrop-blur-xl transition-transform duration-300 ease-in-out dark:border-dark-700 dark:bg-dark-900/80 lg:static lg:z-auto lg:h-auto',
          isMobile ? (mobileMenuOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
        )}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-light-200 px-4 dark:border-dark-700">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-gold-500">
              <span className="text-xs font-bold text-dark-950">XAU</span>
            </div>
            <span className="text-lg font-semibold text-light-900 dark:text-dark-50">XAU Pro</span>
          </Link>
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="btn-ghost btn-sm btn-icon lg:hidden"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" role="navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                      : 'text-light-700 hover:bg-light-200 hover:text-light-900 dark:text-dark-300 dark:hover:bg-dark-800 dark:hover:text-white'
                  )
                }
                onClick={() => isMobile && setMobileMenuOpen(false)}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                {item.label}
              </NavLink>
            );
          })}

          {/* Admin link */}
          {user?.role === 'admin' && (
            <>
              <div className="my-2 h-px bg-light-200 dark:bg-dark-700" />
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'border border-gold-500/30 bg-gold-500/20 text-gold-400'
                      : 'text-light-700 hover:bg-light-200 hover:text-light-900 dark:text-dark-300 dark:hover:bg-dark-800 dark:hover:text-white'
                  )
                }
                onClick={() => isMobile && setMobileMenuOpen(false)}
              >
                <Shield className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                Admin Panel
              </NavLink>
            </>
          )}
        </nav>

        {/* User section */}
        <div className="border-t border-light-200 p-3 dark:border-dark-700">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-light-200 dark:bg-dark-800">
              <User className="h-4 w-4 text-light-500 dark:text-dark-400" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-light-900 dark:text-white">
                {user?.name}
              </p>
              <p className="truncate text-xs capitalize text-light-500 dark:text-dark-500">
                {user?.role}
              </p>
            </div>
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
      <main className={cn('flex min-w-0 flex-1 flex-col', sidebarOpen ? 'lg:ml-0' : '')}>
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-light-200 bg-light-100/80 px-4 backdrop-blur-xl dark:border-dark-700 dark:bg-dark-900/80 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={isMobile ? () => setMobileMenuOpen(true) : toggleSidebar}
              className="btn-ghost btn-icon lg:hidden"
              aria-label={isMobile ? 'Open menu' : 'Toggle sidebar'}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              onClick={toggleSidebar}
              className="btn-ghost btn-icon hidden lg:flex"
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme toggle could go here */}
            <div className="hidden items-center gap-2 rounded-lg bg-light-200 px-3 py-1.5 text-xs text-light-600 dark:bg-dark-800 dark:text-dark-400 sm:flex">
              <span className="font-mono text-gold-400">XAUUSD</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

// Simple Link component to avoid importing from react-router-dom in this file
function Link({
  to,
  children,
  className,
}: {
  to: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a href={to} className={className}>
      {children}
    </a>
  );
}
