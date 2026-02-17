/**
 * Application bootstrap — mounts the React tree into the DOM.
 * Wraps the app in StrictMode (for development warnings) and BrowserRouter
 * (for client-side routing via react-router-dom).
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
