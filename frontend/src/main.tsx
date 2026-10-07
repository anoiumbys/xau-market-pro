import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import App from './App';
import useAuthStore from '@stores/authStore';
import { useUIStore } from '@stores/uiStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './styles/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Initialize auth and theme before rendering
async function bootstrap() {
  await Promise.all([
    useAuthStore.getState().initialize(),
    useUIStore.getState().initializeTheme(),
  ]);

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
          <Toaster position="top-right" theme="dark" />
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

void bootstrap();
