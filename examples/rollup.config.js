// rollup.config.js
import commonJS from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
  output: {
    format: 'iife'
  },
  plugins: [
    resolve(),
    commonJS({
      include: 'node_modules/**'
    })
  ]
};
