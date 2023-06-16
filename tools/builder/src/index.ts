#!/usr/bin/env node

import esbuild from 'esbuild';
import glslTranspiler from '@threeify/esbuild-plugin-glsl-transpiler';
import { glob } from 'glob';

export const main = async () => {
  // read the first command line argument as an string representing an entry point
  const entryPointGlob = process.argv[2];
  const entryPoints = glob.sync(entryPointGlob);

  const watch = process.argv.includes('--watch');

  const params = {
    entryPoints: entryPoints,
    bundle: true,
    sourcemap: true,
    outbase: 'src',
    outdir: 'dist',
    plugins: [glslTranspiler]
  };

  if (watch) {
    const ctx = await esbuild.context(params);
    await ctx.watch();
  } else {
    await esbuild.build(params);
  }
};
