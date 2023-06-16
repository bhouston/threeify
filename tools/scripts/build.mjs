#!/usr/bin/env node

import esbuild from 'esbuild';
import glslTranspiler from '@threeify/esbuild-plugin-glsl-transpiler';
import glob from 'glob';

// read the first command line argument as an string representing an entry point
const entryPointGlob = process.argv[2];
const entryPoints = glob.sync(entryPointGlob);

esbuild
  .build({
    entryPoints: entryPoints,
    bundle: true,
    minify: true,
    treeShaking: true,
    sourcemap: true,
    outbase: 'src',
    outdir: 'dist',
    plugins: [glslTranspiler]
  })
  .catch(() => process.exit(1));
