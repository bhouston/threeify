#!/usr/bin/env -S node --experimental-modules

/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';

import glob from 'glob';
import watch from 'watch';

import { Options, getOptions } from './options.js';
import { transpile } from './transpiler.js';

async function main() {
  const options = await getOptions();

  options.projectDir = path.resolve(options.projectDir);

  const rootDir = path.join(options.projectDir, options.rootDir);
  const outDir = path.join(options.projectDir, options.outDir);

  if (options.verboseLevel > 0) {
    console.log(`projectDir: ${options.projectDir}`);
    console.log(`rootDir: ${rootDir}`);
    console.log(`outDir: ${outDir}`);
  }

  if (!fs.existsSync(rootDir)) {
    console.error(`specified root directory ${rootDir} does not exist`);
    process.exit(1);
  }

  // create the output directory if it doesn't exist
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // find all the glsl files in the root directory
  const files = glob.sync('**/*.glsl', { cwd: rootDir });

  // transpile each file
  for (const file of files) {
    const src = path.join(rootDir, file);
    const dest = path.join(outDir, file) + '.ts';
    console.log(`transpiling ${src} to ${dest}`);
    transpile(src, dest, options);
  }

  // watch for changes
  if (options.watch) {
    console.log('watching for changes');
    watch.watchTree(rootDir, (f, curr, prev) => {
      if (typeof f === 'object' && prev === null && curr === null) {
        // Finished walking the tree
      } else if (prev === null) {
        // f is a new file
      } else if (curr.nlink === 0) {
        // f was removed
      } else {
        // f was changed
      }
    });
  }
}

main();
