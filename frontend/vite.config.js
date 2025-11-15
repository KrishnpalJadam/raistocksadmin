// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // 👇 ensures all paths work correctly when hosted on a subdomain root
  base: '/',

  // 👇 optional — cleaner imports (e.g. import x from '@/components/x')
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // 👇 build optimizations for production hosting
  build: {
    outDir: 'dist',          // output folder (default)
    sourcemap: false,        // disable source maps in production
    chunkSizeWarningLimit: 1000, // avoid large file warnings
    rollupOptions: {
      output: {
        manualChunks: undefined, // keeps it simple for shared hosting
      },
    },
  },

  // 👇 optional server config (used only when testing locally)
  server: {
    host: true,
    port: 5174,
    open: true,
  },
})