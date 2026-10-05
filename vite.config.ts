import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Сайт живёт на GitHub Pages в подпапке /krema-coffee/ (Vercel из РФ с 2026-10 открывается с перебоями).
export default defineConfig({
  base: '/krema-coffee/',
  plugins: [react()],
})
