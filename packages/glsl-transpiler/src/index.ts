#!/usr/bin/env -S node --experimental-modules

/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';

import glob from 'glob';
import watch from 'watch';

import { getOptions } from './options.js';
import { transpile } from './transpiler.js';

function throttle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  let timer: NodeJS.Timer | null = null;

  return function (this: any, ...args: any[]) {
    if (timer === null) {
      timer = setTimeout(() => {
        callback.apply(this, args);
        timer = null;
      }, delay);
    }
  } as T;
}

async function main() {
  const options = await getOptions();

  console.log('options', options);

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
    //console.log(`transpiling ${src} to ${dest}`);
    transpile(src, dest, options);
  }

  // watch for changes
  if (options.watch) {
    console.log('glsl-transpiler - watching for changes');

    const trottleRecompiler = throttle(() => {
      // find all the glsl files in the root directory
      const files = glob.sync('**/*.glsl', { cwd: rootDir });

      // transpile each file
      for (const file of files) {
        const src = path.join(rootDir, file);
        const dest = path.join(outDir, file) + '.ts';
        //console.log(`transpiling ${src} to ${dest}`);
        transpile(src, dest, options);
      }
    }, 0);

    watch.watchTree(rootDir, (f, curr, prev) => {
      console.log('glsl-transpiler - recompile on changes');
      trottleRecompiler();
    });
  }
}

main();
