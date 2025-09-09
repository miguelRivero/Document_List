import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: './index.html',
    },
  },
  server: {
    port: 8081,
    open: true,
  },
});
