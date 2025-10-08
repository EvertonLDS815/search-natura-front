import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Aceitar conexões de qualquer IP na rede local
    port: 3001,        // A porta que você deseja usar
  },
})
