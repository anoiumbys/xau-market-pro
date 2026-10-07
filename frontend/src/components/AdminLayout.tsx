import { Outlet, NavLink, useLocation } from 'react-router-dom';
import useAuthStore, { selectUser } from '@stores/authStore';
import { useUIStore, selectSidebarOpen, selectMobileMenuOpen } from '@stores/uiStore';
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
  ChevronLeft,
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
        aria-label="Admin navigation"
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-light-200 px-4 dark:border-dark-700">
          <NavLink to="/admin/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold-500 to-yellow-600">
              <Shield className="h-5 w-5 text-dark-950" aria-hidden="true" />
            </div>
            <span className="text-lg font-semibold text-light-900 dark:text-white">Admin</span>
          </NavLink>
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
          {ADMIN_NAV_ITEMS.map((item) => {
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
                      ? 'border border-gold-500/30 bg-gold-500/20 text-gold-400'
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
        </nav>

        {/* Back to app link */}
        <div className="border-t border-light-200 p-3 dark:border-dark-700">
          <NavLink
            to="/dashboard"
            className="btn-secondary btn-sm w-full justify-center gap-2"
            onClick={() => isMobile && setMobileMenuOpen(false)}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to App
          </NavLink>
        </div>

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
              <p className="truncate text-xs text-gold-400">Administrator</p>
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
            <div className="hidden items-center gap-2 rounded-lg border border-gold-500/30 bg-gold-500/20 px-3 py-1.5 text-xs font-medium text-gold-400 sm:flex">
              <Shield className="h-3 w-3" aria-hidden="true" />
              Admin Panel
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
