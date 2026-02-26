import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

const dev = false;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: dev ? {
    host: true,
    allowedHosts: true,
    port: 5173
  } : undefined,
  build: {
    sourcemap: false,
    minify: "esbuild",
    chunkSizeWarningLimit: 1000
  },
  preview: {
    port: 4173,
    strictPort: true
  }
})
