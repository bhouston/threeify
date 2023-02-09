// rollup.config.js
import commonJS from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import brotli from 'rollup-plugin-brotli';

export default {
  output: {
    format: 'iife'
  },
  plugins: [
    commonJS({
      include: 'node_modules/**'
    }),
    nodeResolve(),
    terser(),
    brotli()
  ]
};
