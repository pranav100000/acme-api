/**
 * Application bootstrap.
 *
 * Mounts the React app into the DOM, wrapped in:
 *  - StrictMode   – highlights potential problems during development
 *  - BrowserRouter – enables client-side routing via React Router
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
