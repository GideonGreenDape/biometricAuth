import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'WebSdk': path.resolve(__dirname, '/modules/WebSdk'),
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
