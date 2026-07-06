import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    include: ['__tests__/**/*.{test,spec}.{ts,tsx}', 'lib/**/*.test.ts'],
    exclude: ['src/**', 'e2e/**', 'node_modules/**'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
