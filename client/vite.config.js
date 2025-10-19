// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })



import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic', // enables JSX
      babel: {
        presets: [],
        plugins: [],
      },
    }),
  ],
   build: {
    // Increase the warning limit to 2 MB (2048 KB)
    chunkSizeWarningLimit: 2048,
    outDir: "dist"
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5014',
        // target: 'https://blex-thlc.onrender.com',
        changeOrigin: true,
        secure: false,
        // Optional: remove '/api' prefix if needed
        // rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
});
