import { defineConfig } from 'vite';

const API_TARGET = process.env.VITE_API_PROXY || 'http://localhost:3001';

export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/cs2utils/' : './',
  server: {
    proxy: {
      '/api': { target: API_TARGET, changeOrigin: true },
      '/uploads': { target: API_TARGET, changeOrigin: true },
    },
  },
});
