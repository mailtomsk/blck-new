import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['@stripe/stripe-js', '@stripe/react-stripe-js']
  },
  resolve: {
    alias: {
      "@img": "/src/assets/images",
    },
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/]
    }
  }
});
