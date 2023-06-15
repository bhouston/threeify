#!/usr/bin/env node

import esbuild from 'esbuild';
import glslTranspiler from '@threeify/esbuild-plugin-glsl-transpiler';
console.log(glslTranspiler);

const main = async () => {
  const ctx = await esbuild.context({
    entryPoints: ['src/index.ts'],
    bundle: true,
    sourcemap: true,
    outfile: 'dist/index.js',
    plugins: [glslTranspiler]
  });
  await ctx.watch();
};

main();
