import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relative base so the build serves from any path, including
  // https://<user>.github.io/<repo>/ on GitHub Pages.
  base: './',
  server: { port: 5178, strictPort: false },
})
