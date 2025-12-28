import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: process.env.NODE_ENV !== 'production' ? {
      '/api': 'http://localhost:3001'
    } : undefined
  },
})
