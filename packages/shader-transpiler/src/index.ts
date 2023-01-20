#!/bin/sh
/* eslint-disable no-console */
':'; //# comment; exec /usr/bin/env node --experimental-modules "$0" "$@"
import fs from 'node:fs';
import path from 'node:path';
import process, { exit } from 'node:process';

import { program } from 'commander';
import glob from 'glob';
import watch from 'watch';

import { Options } from './Options.js';
import { glslToJavaScriptTranspiler } from './transpiler.js';

function commaSeparatedList(value: string): string[] {
  return value.split(',');
}

const packageJson = JSON.parse(fs.readFileSync('./package.json').toString());

program
  .name('threeify-glsl-transpiler')
  .version(packageJson.version)
  .option(
    '-p, --projectDir <dirpath>',
    `the root of the project directory tree`
  )
  .option('-r, --rootDir <dirpath>', `the root of the source directory tree`)
  .option(
    '-i',
    '--includeDirs <dirpaths>',
    'a series of comma separated include directories'
  )
  .option('-o, --outDir <dirpath>', `the root of the output directory tree`)
  .option('-w, --watch', `watch and incremental transpile any changed files`)
  .option(
    '-j, --allowJSIncludes',
    `allow referencing javascript and typescript code via includes`
  )
  .option('-m, --minify', `reduce the size of the glsl code`)
  .option(
    '-e, --extensions <items>',
    'comma separated list of extensions to transpile',
    commaSeparatedList
  )
  .option(
    '-v, --verboseLevel <level>',
    `higher numbers means more output`,
    Number.parseInt
  );

program.parse(process.argv);

/*
function removeUndefined(obj:any): any {
  const ret = {};
  Object.keys(obj)
    .filter((key) => obj[key] !== undefined)
    .forEach((key) => (ret[key] = obj[key]));
  return ret;
}*/

const options = new Options();

//console.log('fresh options');
//console.log(options);
let projectDir = process.cwd();

const programOptions = program.opts();

if (programOptions.projectDir) {
  projectDir = programOptions.projectDir;
}

const tsConfigFilePath = path.join(projectDir, 'tsconfig.json');
if (fs.existsSync(tsConfigFilePath)) {
  const tsConfig = JSON.parse(fs.readFileSync(tsConfigFilePath).toString());
  if (tsConfig.compilerOptions) {
    if (options.verboseLevel >= 1) {
      console.log(`  inferring setup from ${tsConfigFilePath}.`);
    }
    options.safeCopy({
      rootDir: tsConfig.compilerOptions.rootDir,
      outDir: tsConfig.compilerOptions.outDir
    });

    //console.log('merge in tsconfig');
    //console.log(options);
  }
}

const threeifyFilePath = path.join(projectDir, 'threeify.json');
if (fs.existsSync(threeifyFilePath)) {
  const threeifyConfig = JSON.parse(
    fs.readFileSync(threeifyFilePath).toString()
  );
  if (options.verboseLevel >= 1) {
    console.log(`  reading settings from ${threeifyFilePath}.`);
  }
  if (threeifyConfig.glsl) {
    options.safeCopy(threeifyConfig.glsl);
    //console.log('merge in threeify config');
    //console.log(options);
  }
}

if (options.verboseLevel >= 1) {
  console.log(`  applying command line overrides.`);
}
options.safeCopy(program);
//console.log('merge in cmd line');
//console.log(options);

if (options.verboseLevel >= 2) {
  console.log(options);
}

options.extensions = options.extensions.map((ext) => ext.toLowerCase());

if (!options.rootDir) {
  console.error(`no rootDir specified`);
  exit(0);
}
if (!fs.existsSync(options.rootDir)) {
  console.error(`rootDir doesn't exist: ${options.rootDir}`);
  exit(0);
}
if (!options.outDir) {
  console.error(`no outDir specified`);
  exit(0);
}

options.rootDir = path.normalize(path.join(projectDir, options.rootDir));
options.outDir = path.normalize(path.join(projectDir, options.outDir));
options.includeDirs = options.includeDirs.map((includeDir) =>
  path.normalize(path.join(projectDir, includeDir))
);
if (options.verboseLevel >= 2) {
  console.log(options);
}

let numFiles = 0;
let numErrors = 0;

function inputFileNameToOutputFileName(inputFileName: string): string {
  inputFileName = path.normalize(inputFileName);
  const outputFileName =
    inputFileName.replace(options.rootDir, options.outDir) + '.js';
  return outputFileName;
}

function transpile(sourceFileName: string): string[] {
  if (!fs.lstatSync(sourceFileName).isFile()) {
    return [];
  }

  sourceFileName = path.normalize(sourceFileName);
  const outputFileName = inputFileNameToOutputFileName(sourceFileName);
  const fileErrors = glslToJavaScriptTranspiler(
    sourceFileName,
    outputFileName,
    options
  );

  if (fileErrors.length > 0) {
    numErrors++;
    console.error(
      `  ${sourceFileName} --> ${path.basename(outputFileName)}: ${
        fileErrors.length
      } Errors.`
    );
    fileErrors.forEach((error) => {
      console.error(`    ${error}`);
    });
  } else {
    if (options.verboseLevel >= 1) {
      console.log(`  ${sourceFileName} --> ${path.basename(outputFileName)}`);
    }
  }
  return fileErrors;
}

function isFileSupported(fileName: string): boolean {
  let ext = path.extname(fileName);
  if (ext.length > 1) {
    ext = ext.slice(1);
  }
  const result = options.extensions.includes(ext.toLowerCase());
  return result;
}

// options is optional
const extGlob = options.extensions.join('|');
const globRegex = `${options.rootDir}/**/*.+(${extGlob})`;

glob(globRegex, {}, function (er, sourceFileNames) {
  sourceFileNames.forEach((inputFileName) => {
    numFiles++;
    transpile(inputFileName);
  });

  if (numErrors > 0) {
    console.error(`${numErrors} files failed to transpile.`);
  }
  console.log(`${numFiles - numErrors} files transpile successfully.`);

  if (programOptions.watch) {
    watch.createMonitor(options.rootDir, function (monitor) {
      monitor.on('created', function (sourceFileName: string, stat) {
        if (options.verboseLevel > 1) console.log(`created ${sourceFileName}`);
        if (isFileSupported(sourceFileName)) {
          transpile(sourceFileName);
        }
      });
      monitor.on('changed', function (sourceFileName: string, curr, prev) {
        if (options.verboseLevel > 1) console.log(`changed ${sourceFileName}`);
        if (isFileSupported(sourceFileName)) {
          transpile(sourceFileName);
        }
      });
      monitor.on('removed', function (sourceFileName: string, stat) {
        if (options.verboseLevel > 1) console.log(`removed ${sourceFileName}`);
        if (isFileSupported(sourceFileName)) {
          const outputFileName = inputFileNameToOutputFileName(sourceFileName);
          if (fs.existsSync(outputFileName)) {
            fs.unlinkSync(outputFileName);
          }
        }
      });
    });
  }
});
