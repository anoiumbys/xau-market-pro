import { ReactNode } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import useAuthStore from '@stores/authStore';
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
    <div className="min-h-screen bg-light-50 dark:bg-dark-950 flex">
      {/* Mobile overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static z-50 lg:z-auto h-full lg:h-auto w-64 bg-light-100/80 dark:bg-dark-900/80 backdrop-blur-xl border-r border-light-200 dark:border-dark-700 flex flex-col transition-transform duration-300 ease-in-out',
          isMobile ? (mobileMenuOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
        )}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-light-200 dark:border-dark-700">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center">
              <span className="text-xs font-bold text-dark-950">XAU</span>
            </div>
            <span className="font-semibold text-lg text-light-900 dark:text-dark-50">XAU Pro</span>
          </Link>
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="btn-ghost btn-sm btn-icon lg:hidden"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" role="navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                      : 'text-light-700 dark:text-dark-300 hover:bg-light-200 dark:hover:bg-dark-800 hover:text-light-900 dark:hover:text-white'
                  )
                }
                onClick={() => isMobile && setMobileMenuOpen(false)}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                {item.label}
              </NavLink>
            );
          })}

          {/* Admin link */}
          {user?.role === 'admin' && (
            <>
              <div className="h-px bg-light-200 dark:bg-dark-700 my-2" />
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                      : 'text-light-700 dark:text-dark-300 hover:bg-light-200 dark:hover:bg-dark-800 hover:text-light-900 dark:hover:text-white'
                  )
                }
                onClick={() => isMobile && setMobileMenuOpen(false)}
              >
                <Shield className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                Admin Panel
              </NavLink>
            </>
          )}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-light-200 dark:border-dark-700">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-light-200 dark:bg-dark-800 flex items-center justify-center">
              <User className="w-4 h-4 text-light-500 dark:text-dark-400" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-light-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-light-500 dark:text-dark-500 truncate capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full btn-secondary btn-sm justify-start gap-2 mt-2"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={cn('flex-1 flex flex-col min-w-0', sidebarOpen ? 'lg:ml-0' : '')}>
        {/* Top bar */}
        <header className="h-16 bg-light-100/80 dark:bg-dark-900/80 backdrop-blur-xl border-b border-light-200 dark:border-dark-700 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={isMobile ? () => setMobileMenuOpen(true) : toggleSidebar}
              className="btn-ghost btn-icon lg:hidden"
              aria-label={isMobile ? 'Open menu' : 'Toggle sidebar'}
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              onClick={toggleSidebar}
              className="btn-ghost btn-icon hidden lg:flex"
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {sidebarOpen ? (
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme toggle could go here */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-light-200 dark:bg-dark-800 rounded-lg text-xs text-light-600 dark:text-dark-400">
              <span className="font-mono text-gold-400">XAUUSD</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

// Simple Link component to avoid importing from react-router-dom in this file
function Link({ to, children, className }: { to: string; children: ReactNode; className?: string }) {
  return (
    <a href={to} className={className}>
      {children}
    </a>
  );
}