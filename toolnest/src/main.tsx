import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { FavoritesProvider } from './hooks/useFavorites';
import { ConsentProvider } from './hooks/useConsent';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ConsentProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </ConsentProvider>
    </BrowserRouter>
  </StrictMode>
);
