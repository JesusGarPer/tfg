/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    // Le indicamos que busque solo dentro de la carpeta src de React
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    // Y que ignore los directorios de Playwright o dependencias
    exclude: ['**/node_modules/**', '**/e2e/**', '**/tests/example.spec.ts'],
    alias: {
      // Forzamos a Vitest a usar única y exclusivamente las dependencias locales del frontend
      'react': resolve(__dirname, './node_modules/react'),
      'react-dom': resolve(__dirname, './node_modules/react-dom'),
    }
  },
  server: {
    watch: {
      usePolling: true, // Habilita el polling para que Docker en Windows detecte los cambios
    },
  },
})
