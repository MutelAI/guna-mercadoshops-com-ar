/// <reference types="vitest" />

import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    target: ['es2020'],
  },
  resolve: {
    mainFields: ['module'],
    dedupe: [
      '@angular/core',
      '@angular/common',
      '@angular/platform-browser',
      '@angular/router',
      '@angular/forms',
    ],
  },
  optimizeDeps: {
    include: [
      '@angular/core',
      '@angular/common',
      '@angular/common/http',
      '@angular/platform-browser',
      '@angular/platform-browser/animations',
      '@angular/router',
      '@angular/forms',
    ],
  },
  plugins: [
    analog({
      ssr: false,
      static: true,
      prerender: {
        routes: [],
      },
    }),
    tailwindcss()
  ],
}));
