/* eslint-disable no-console */
import fs from 'node:fs';
import { promises as fsPromises } from 'node:fs';
import path from 'node:path';
import process, { exit } from 'node:process';

import { Command } from 'commander';

export type Options = {
  projectDir: string;
  rootDir: string;
  outDir: string;
  watch: boolean;
  minify: boolean;
  verboseLevel: number;
};

const configFileName = 'glsl-transpiler.json';

export type OptionsOverride = {
  projectDir?: string;
  rootDir?: string;
  outDir?: string;
  watch?: boolean;
  minify?: boolean;
  verboseLevel?: number;
};

const defaultOptions = {
  projectDir: process.cwd(),
  rootDir: 'glsl',
  outDir: 'src',
  watch: false,
  minify: false,
  verboseLevel: 0
} as Options;

export async function getOptions() {
  const packageJson = JSON.parse(
    await fsPromises.readFile('./package.json', 'utf-8')
  );

  const program = new Command();

  program
    .name(packageJson.name)
    .version(packageJson.version)
    .option(
      '-p, --projectDir <dirpath>',
      `the root of the project directory tree`
    )
    .option('-r, --rootDir <dirpath>', `the root of the source directory tree`)
    .option('-o, --outDir <dirpath>', `the root of the output directory tree`)
    .option('-w, --watch', `watch and incremental transpile any changed files`)
    .option('-m, --minify', `reduce the size of the glsl code`)
    .option(
      '-v, --verboseLevel <level>',
      `higher numbers means more output`,
      Number.parseInt
    );

  program.parse(process.argv);

  const cmdLineOptions = program.opts() as OptionsOverride;

  const projectDir = cmdLineOptions.projectDir || defaultOptions.projectDir;

  // look for the existance of a threeify.json file located in the project directory
  const threeifyJsonPath = path.join(projectDir, configFileName);
  let threeifyOptions = {} as OptionsOverride;
  if (fs.existsSync(threeifyJsonPath)) {
    // read the file and convert to json
    const configFileOptions = JSON.parse(
      await fsPromises.readFile(threeifyJsonPath, 'utf-8')
    ) as OptionsOverride;
    if (configFileOptions.projectDir) {
      console.error(
        `The ${configFileName} file cannot contain a projectDir property ${configFileOptions.projectDir}`
      );
      exit(1);
    }
    threeifyOptions = { ...threeifyOptions, ...configFileOptions };
  }

  // combine the options in order of preference...
  return {
    ...defaultOptions,
    ...threeifyOptions,
    ...cmdLineOptions
  } as Options;
}
