import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Changed from '/damage-calculator/' for custom domain torifun.co.kr
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
