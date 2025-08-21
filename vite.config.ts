import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@arcgis/core']
  },
  define: {
    global: 'globalThis'
  },
  server: {
    fs: {
      allow: ['..']
    }
  },
  resolve: {
    alias: {
      // This helps with ESRI module resolution
      '@arcgis/core': '@arcgis/core'
    }
  },
  build: {
    rollupOptions: {
      external: (id) => {
        // Don't bundle @arcgis/core modules during build - they should be loaded from CDN
        return id.includes('@arcgis/core')
      }
    }
  }
})
