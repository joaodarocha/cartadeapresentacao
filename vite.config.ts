import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    open: true,
    proxy: {
      '/sitemap.xml': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  },
})
