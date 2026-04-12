/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';

import glob from 'tiny-glob';
import watch from 'watch';

import { getOptions } from './options.ts';
import { discoverBuildProjects } from './tsconfig-discovery.ts';
import { transpile } from './transpiler.ts';

function throttle<T extends (...args: any[]) => any>(callback: T, delay: number): T {
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

export async function main() {
  const options = await getOptions();

  options.projectDir = path.resolve(options.projectDir);

  if (options.buildMode) {
    const tsconfigPath = path.resolve(options.projectDir, options.tsconfigPath);
    const projects = await discoverBuildProjects(tsconfigPath);

    if (options.verboseLevel > 0) {
      console.log(`buildMode: true`);
      console.log(`tsconfigPath: ${tsconfigPath}`);
      console.log(`projects: ${projects.length}`);
    }

    for (const project of projects) {
      await transpileProject(options, project.projectDir, project.rootDir, project.outDir, project.tsconfigPath, true);
    }

    if (!options.watch) {
      return;
    }

    console.log('glsl-transpiler - watching all projects for changes');

    for (const project of projects) {
      const rootDir = path.resolve(project.projectDir, project.rootDir);

      if (!fs.existsSync(rootDir)) {
        continue;
      }

      const throttledRecompiler = throttle(async () => {
        await transpileProject(options, project.projectDir, project.rootDir, project.outDir, project.tsconfigPath, true);
      }, 0);

      watch.watchTree(rootDir, (f, _curr, _prev) => {
        if (typeof f === 'string' && f.endsWith('.glsl')) {
          console.log('glsl-transpiler - recompile on changes', f);
          throttledRecompiler();
        }
      });
    }

    return;
  }

  const rootDir = path.join(options.projectDir, options.rootDir);

  await transpileProject(options, options.projectDir, options.rootDir, options.outDir);

  // watch for changes
  if (options.watch) {
    console.log('glsl-transpiler - watching for changes');

    const trottleRecompiler = throttle(async () => {
      await transpileProject(options, options.projectDir, options.rootDir, options.outDir);
    }, 0);

    watch.watchTree(rootDir, (f, _curr, _prev) => {
      if (f.endsWith('.glsl')) {
        console.log('glsl-transpiler - recompile on changes', f);
        trottleRecompiler();
      }
    });
  }
}

async function transpileProject(
  options: Awaited<ReturnType<typeof getOptions>>,
  projectDir: string,
  relativeRootDir: string,
  relativeOutDir: string,
  tsconfigPath?: string,
  skipMissingRootDir = false,
) {
  const rootDir = path.resolve(projectDir, relativeRootDir);
  const outDir = path.resolve(projectDir, relativeOutDir);

  if (options.verboseLevel > 0) {
    console.log(`projectDir: ${projectDir}`);
    if (tsconfigPath) {
      console.log(`tsconfigPath: ${tsconfigPath}`);
    }
    console.log(`rootDir: ${rootDir}`);
    console.log(`outDir: ${outDir}`);
    console.log(`watch: ${options.watch}`);
    console.log(`minify: ${options.minify}`);
  }

  if (!fs.existsSync(rootDir)) {
    if (skipMissingRootDir) {
      if (options.verboseLevel > 0) {
        console.log(`skipping project without rootDir: ${rootDir}`);
      }
      return;
    }

    console.error(`specified root directory ${rootDir} does not exist`);
    process.exit(1);
  }

  // create the output directory if it doesn't exist
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // find all the glsl files in the root directory
  const files = await glob('**/*.glsl', { cwd: rootDir });

  // transpile each file
  for (const file of files) {
    const src = path.join(rootDir, file);
    const dest = path.join(outDir, file) + '.ts';
    //console.log(`transpiling ${src} to ${dest}`);
    transpile(src, dest, options);
  }
}
