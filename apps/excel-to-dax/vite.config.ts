import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',             // IMPORTANT: relative paths for subfolder hosting
  build: {
    outDir: '../../tools/excel-to-dax', // write build directly into public site
    emptyOutDir: true
  }
})
