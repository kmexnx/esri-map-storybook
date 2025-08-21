import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// ESRI Configuration - this is crucial for proper asset loading
import esriConfig from '@arcgis/core/config.js';

// Set the ESRI assets path - this resolves the module loading issues
esriConfig.assetsPath = '/assets';

// Import ESRI CSS after configuration
import '@arcgis/core/assets/esri/themes/light/main.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
