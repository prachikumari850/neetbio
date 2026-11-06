import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          minSize: 10 * 1024,
          groups: [
            {
              name: 'lucide-icons',
              test: /node_modules[\\/]lucide-react[\\/]/,
              priority: 10,
            },
            {
              name: 'shared-ui',
              test: /src[\\/]components[\\/]/,
              minShareCount: 2,
              priority: 5,
            },
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
