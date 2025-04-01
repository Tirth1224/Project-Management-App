import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      '6c3c-2405-201-2001-f096-5d72-650-c607-9a11.ngrok-free.app'
    ]
  }
})


