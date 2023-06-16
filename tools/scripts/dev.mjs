#!/usr/bin/env node

import esbuild from 'esbuild';
import glslTranspiler from '@threeify/esbuild-plugin-glsl-transpiler';

// read the first command line argument as an string representing an entry point
const entryPointGlob = process.argv[2];
const entryPoints = glob.sync(entryPointGlob);

const main = async () => {
  const ctx = await esbuild.context({
    entryPoints: entryPoints,
    bundle: true,
    sourcemap: true,
    outbase: 'src',
    outdir: 'dist',
    plugins: [glslTranspiler]
  });
  await ctx.watch();
};

main();
