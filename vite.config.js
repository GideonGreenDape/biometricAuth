import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Map 'WebSdk' to the global object or a no-op
      'WebSdk': 'C:/Users/IBOYI EMMANUEL/biometricAuth/src/modules/WebSdk'
    },
  },
  build: {
    rollupOptions: {
      // Mark WebSdk as an external dependency
      external: ['WebSdk'],
    },
  },
  optimizeDeps: {
    exclude: ['crypto']
  }
})
