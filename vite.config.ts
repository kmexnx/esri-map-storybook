import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      '@arcgis/core/geometry',
      '@arcgis/core/layers/FeatureLayer',
      '@arcgis/core/layers/GraphicsLayer',
      '@arcgis/core/Map',
      '@arcgis/core/views/MapView',
      '@arcgis/core/Graphic',
      '@arcgis/core/geometry/Point',
      '@arcgis/core/geometry/Polyline',
      '@arcgis/core/geometry/Polygon',
      '@arcgis/core/symbols/SimpleMarkerSymbol',
      '@arcgis/core/symbols/SimpleLineSymbol',
      '@arcgis/core/symbols/SimpleFillSymbol'
    ],
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
  build: {
    rollupOptions: {
      external: (id) => {
        // Don't bundle @arcgis/core modules during build
        return id.includes('@arcgis/core')
      }
    }
  }
})
