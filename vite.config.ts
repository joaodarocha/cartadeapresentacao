import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    open: true,
    proxy: {
      '/sitemap.xml': {
        target: process.env.REACT_APP_API_URL || 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  },
})

