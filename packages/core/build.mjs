#!/usr/bin/env node

import esbuild from 'esbuild';
import glslTranspiler from '@threeify/esbuild-plugin-glsl-transpiler';
console.log(glslTranspiler);

esbuild
  .build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    sourcemap: true,
    outfile: 'dist/index.js',
    plugins: [glslTranspiler]
  })
  .catch(() => process.exit(1));
