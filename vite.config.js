import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  
  // Con HashRouter, usar '/' como base
  base: './',

  resolve: {
    alias: {
      '/components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '/pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '/utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
    }
  }
})