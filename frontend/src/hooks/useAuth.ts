import { useAuthStore, selectAuth, selectUser, selectIsAuthenticated, selectIsLoading } from '@stores/authStore';

export function useAuth() {
  return useAuthStore(selectAuth);
}

export function useUser() {
  return useAuthStore(selectUser);
}

export function useIsAuthenticated() {
  return useAuthStore(selectIsAuthenticated);
}

export function useIsLoading() {
  return useAuthStore(selectIsLoading);
}