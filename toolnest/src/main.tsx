import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { FavoritesProvider } from './hooks/useFavorites';
import { ConsentProvider } from './hooks/useConsent';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
    <BrowserRouter>
      <ConsentProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </ConsentProvider>
    </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
