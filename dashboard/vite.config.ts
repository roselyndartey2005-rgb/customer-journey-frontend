import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://customer-journey-backend-zo4y.onrender.com',
        changeOrigin: true,
        secure: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('referer');
          });
          proxy.on('proxyRes', (proxyRes, _req, res) => {
            const setCookie = proxyRes.headers['set-cookie'];
            if (setCookie) {
              const jwtCookie = setCookie.find((c: string) => c.startsWith('jwt='));
              if (jwtCookie) {
                const token = jwtCookie.split(';')[0].replace('jwt=', '');
                res.setHeader('x-auth-token', token);
              }
            }
          });
        },
      },
    },
  },
})
