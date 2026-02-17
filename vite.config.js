/**
 * Vite configuration for the React frontend.
 * In development, API and health-check requests are proxied to the Express backend
 * running on port 3000. Production builds are output to the /public directory
 * where Express serves them as static files.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'frontend', // Frontend source lives in its own directory
  build: {
    outDir: '../public', // Output relative to root → project_root/public
    emptyOutDir: true,   // Clean the output directory before each build
  },
  server: {
    port: 5173,
    // Proxy API calls to the Express backend during local development
    proxy: {
      '/api': 'http://localhost:3000',
      '/health': 'http://localhost:3000',
    },
  },
});
