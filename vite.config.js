import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Map 'WebSdk' to the global object or a no-op
      'WebSdk': path.resolve(__dirname, '/modules/WebSdk/index.js'),
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
