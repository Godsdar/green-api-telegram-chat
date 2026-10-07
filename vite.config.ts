/// <reference types="vitest" />
import { configDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    environmentOptions: { jsdom: { url: 'http://localhost/' } },
    setupFiles: './src/test/setup.ts',
    css: false,
    restoreMocks: true,
    exclude: [...configDefaults.exclude, 'e2e/**'],
  },
});
