import useAuthStore, { type AuthStore } from '@stores/authStore';

export function useAuth() {
  return useAuthStore((state) => ({
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
  }));
}

export function useUser() {
  return useAuthStore((state) => state.user);
}

export function useIsAuthenticated() {
  return useAuthStore((state) => state.isAuthenticated);
}

export function useIsLoading() {
  return useAuthStore((state) => state.isLoading);
}