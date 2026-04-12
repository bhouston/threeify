/* eslint-disable no-console */
import fs from 'node:fs';
import { promises as fsPromises } from 'node:fs';
import path from 'node:path';
import process, { exit } from 'node:process';

import { Command } from 'commander';

export type Options = {
  projectDir: string;
  tsconfigPath: string;
  rootDir: string;
  outDir: string;
  buildMode: boolean;
  watch: boolean;
  minify: boolean;
  verboseLevel: number;
  jsExtension: boolean;
};

const configFileName = 'glsl-transpiler.json';

export type OptionsOverride = {
  projectDir?: string;
  tsconfigPath?: string;
  rootDir?: string;
  outDir?: string;
  buildMode?: boolean;
  watch?: boolean;
  minify?: boolean;
  verboseLevel?: number;
  jsExtension?: boolean;
};

const defaultOptions = {
  projectDir: process.cwd(),
  tsconfigPath: 'tsconfig.json',
  rootDir: 'src',
  outDir: 'src',
  buildMode: false,
  watch: false,
  minify: false,
  verboseLevel: 0,
  jsExtension: true,
} as Options;

export async function getOptions() {
  const packageJson = JSON.parse(await fsPromises.readFile('./package.json', 'utf-8'));

  const program = new Command();

  program
    .name(packageJson.name)
    .version(packageJson.version)
    .option('-p, --projectDir <dirpath>', `the root of the project directory tree`)
    .option('-c, --tsconfigPath <filepath>', `the tsconfig file to use in build mode`)
    .option('-r, --rootDir <dirpath>', `the root of the source directory tree`)
    .option('-o, --outDir <dirpath>', `the root of the output directory tree`)
    .option('-b, --buildMode', `run for all referenced tsconfig projects`)
    .option('-w, --watch', `watch and incremental transpile any changed files`)
    .option('-m, --minify', `reduce the size of the glsl code`)
    .option('-v, --verboseLevel <level>', `higher numbers means more output`, Number.parseInt);

  program.parse(process.argv);

  const cmdLineOptions = program.opts() as OptionsOverride;

  const projectDir = cmdLineOptions.projectDir || defaultOptions.projectDir;

  // look for the existance of a threeify.json file located in the project directory
  const threeifyJsonPath = path.join(projectDir, configFileName);
  let threeifyOptions = {} as OptionsOverride;
  if (fs.existsSync(threeifyJsonPath)) {
    // read the file and convert to json
    const configFileOptions = JSON.parse(await fsPromises.readFile(threeifyJsonPath, 'utf-8')) as OptionsOverride;
    if (configFileOptions.projectDir) {
      console.error(`The ${configFileName} file cannot contain a projectDir property ${configFileOptions.projectDir}`);
      exit(1);
    }
    threeifyOptions = { ...threeifyOptions, ...configFileOptions };
  }

  // combine the options in order of preference...
  const options = {
    ...defaultOptions,
    ...threeifyOptions,
    ...cmdLineOptions,
  } as Options;

  if (options.buildMode && (cmdLineOptions.rootDir || cmdLineOptions.outDir)) {
    console.error('--buildMode cannot be used with --rootDir or --outDir');
    exit(1);
  }

  return options;
}
