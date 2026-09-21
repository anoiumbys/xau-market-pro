import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@stores/authStore';
import { Layout } from '@components/Layout';
import { LoginPage } from '@pages/LoginPage';
import { RegisterPage } from '@pages/RegisterPage';
import { ForgotPasswordPage } from '@pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@pages/ResetPasswordPage';
import { DashboardPage } from '@pages/DashboardPage';
import { ChartPage } from '@pages/ChartPage';
import { JournalPage } from '@pages/JournalPage';
import { AlertsPage } from '@pages/AlertsPage';
import { SubscriptionPage } from '@pages/SubscriptionPage';
import { ReportsPage } from '@pages/ReportsPage';
import { SettingsPage } from '@pages/SettingsPage';
import { AdminLayout } from '@components/AdminLayout';
import { AdminDashboardPage } from '@pages/admin/AdminDashboardPage';
import { AdminUsersPage } from '@pages/admin/AdminUsersPage';
import { AdminMarketsPage } from '@pages/admin/AdminMarketsPage';
import { AdminSubscriptionsPage } from '@pages/admin/AdminSubscriptionsPage';
import { AdminAlertsPage } from '@pages/admin/AdminAlertsPage';
import { AdminJournalPage } from '@pages/admin/AdminJournalPage';
import { AdminReportsPage } from '@pages/admin/AdminReportsPage';
import { AdminSettingsPage } from '@pages/admin/AdminSettingsPage';
import { NotFoundPage } from '@pages/NotFoundPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="animate-spin-slow rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="animate-spin-slow rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected user routes */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/chart" element={<ChartPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Admin routes */}
      <Route
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/markets" element={<AdminMarketsPage />} />
        <Route path="/admin/subscriptions" element={<AdminSubscriptionsPage />} />
        <Route path="/admin/alerts" element={<AdminAlertsPage />} />
        <Route path="/admin/journal" element={<AdminJournalPage />} />
        <Route path="/admin/reports" element={<AdminReportsPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}