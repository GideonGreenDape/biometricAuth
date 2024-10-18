import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import amd from 'vite-plugin-amd';


export default defineConfig({
  plugins: [react(),
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env'],
      extensions: ['.js', '.jsx', '.ts', '.tsx'], 
    }),
    amd(),
    commonjs()
  ],
  resolve: {
    alias: {
      'WebSdk': path.resolve(__dirname, 'modules/WebSdk/index.js'),
    },
  },
  build: {
    rollupOptions: {
      // Mark WebSdk as an external dependency
      external: ['WebSdk'],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    },
  },
  optimizeDeps: {
    exclude: ['crypto'],
  }
})
