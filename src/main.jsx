// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { Toaster } from 'sonner';
import './App.css';
import './assets/fonts/fonts.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <div id="app-wrapper" style={{ position: 'relative', minHeight: '100vh' }}>
        <App />
        <Toaster position="top-center" />
      </div>
    </BrowserRouter>
  </React.StrictMode>
);