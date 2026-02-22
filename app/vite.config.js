import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const backendPort = process.env.PORT || 3000;

export default defineConfig({
  plugins: [react()],
  root: 'client',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': `http://localhost:${backendPort}`,
      '/ws': {
        target: `ws://localhost:${backendPort}`,
        ws: true,
      },
      '/outputs': `http://localhost:${backendPort}`,
    },
  },
});
