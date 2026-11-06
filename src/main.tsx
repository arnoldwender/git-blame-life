import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
/* Self-hosted font: loading it from Google Fonts sent every visitor's IP to Google without consent (LG München I, 3 O 17493/20) */
import '@fontsource/jetbrains-mono/300.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/jetbrains-mono/700.css';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
