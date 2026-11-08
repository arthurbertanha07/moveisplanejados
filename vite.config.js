import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Endereço público usado no canonical e no Open Graph (index.html).
  // Se VITE_SITE_URL não vier do .env nem da hospedagem, usa este padrão.
  const env = loadEnv(mode, process.cwd(), '');
  if (!env.VITE_SITE_URL) process.env.VITE_SITE_URL = 'https://lumen-moveis.vercel.app';

  return {
    plugins: [react()],
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      sourcemap: false,
      chunkSizeWarningLimit: 900, // o 3D (Three.js) é carregado sob demanda
    },
  };
});
