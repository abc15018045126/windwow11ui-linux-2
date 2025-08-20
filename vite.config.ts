import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@kernel': path.resolve(__dirname, './src/window'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './services'),
    },
  },
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000,
  },
});

