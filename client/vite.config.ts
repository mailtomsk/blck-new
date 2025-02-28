import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server : {
    port : 5004
  },
  resolve: {
    alias: {
      "@img": "/src/assets/images",
    },
  },
});
