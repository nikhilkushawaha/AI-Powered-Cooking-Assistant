import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          // Only used in development
          // Production uses VITE_API_URL directly
        }
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: false,       // disable in production for security
      minify: 'terser',       // better minification
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // Split vendor chunks for better caching
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            query: ['@tanstack/react-query'],
            state: ['zustand'],
          }
        }
      }
    },
    define: {
      __API_URL__: JSON.stringify(env.VITE_API_URL)
    }
  }
})
