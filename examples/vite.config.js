import glslTranspiler from '@threeify/rollup-plugin-glsl-transpiler';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:3001'
    },
    host: '0.0.0.0' // allow for local external connections
  },
  plugins: [glslTranspiler()]
});
