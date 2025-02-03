import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/scss/App.scss';
import { App } from '@/App';
import '@/assets/fonts/RobotoFlex.ttf';
import '@/assets/fonts/RobotoMono.ttf';
import '@/assets/fonts/RobotoMono-Italic.ttf';

const rootDiv = document.getElementById('root');

if (!rootDiv) {
  throw new Error('No root element found');
} else {
  createRoot(rootDiv).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
