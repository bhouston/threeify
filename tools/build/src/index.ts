#!/usr/bin/env node

import esbuild from 'esbuild';
import glslTranspiler from '@threeify/esbuild-plugin-glsl-transpiler';
import { glob } from 'glob';

export const main = async () => {
  // read the first command line argument as an string representing an entry point
  const entryPointGlob = process.argv[2];
  const entryPoints = glob.sync(entryPointGlob);

  const bundle = process.argv.includes('--bundle');
  const optimize = process.argv.includes('--optimize');

  const watch = process.argv.includes('--watch');
  const serve = process.argv.includes('--serve');
  const format = process.argv.includes('--iife') ? 'iife' : 'esm';

  const params = {
    entryPoints: entryPoints,
    bundle: bundle,
    minify: optimize,
    format: format,
    treeShaking: optimize,
    sourcemap: true,
    outbase: 'src',
    outdir: 'dist',
    plugins: [glslTranspiler]
  } as esbuild.BuildOptions;

  if (serve) {
    const ctx = await esbuild.context(params);
    await ctx.serve({
      port: 8001,
      host: 'localhost',
      servedir: '.'
    } as esbuild.ServeOptions);
  } else if (watch) {
    const ctx = await esbuild.context(params);
    await ctx.watch();
  } else {
    await esbuild.build(params);
  }
};
