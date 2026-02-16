/**
 * Application bootstrap.
 *
 * Mounts the React component tree into the DOM. Wraps the app in:
 * - React.StrictMode  — enables additional dev-time warnings
 * - BrowserRouter     — provides client-side routing via React Router
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
