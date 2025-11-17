import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  
  // Para GitHub Pages en subdirectorio con HashRouter
  base: '/ZunyFernandezPropiedades/',

  resolve: {
    alias: {
      '/components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '/pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '/utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
    }
  },
  
  // IMPORTANTE: Asegurar que los assets públicos usen rutas correctas
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  }
})