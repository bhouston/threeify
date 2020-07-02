import { exec } from "child_process";
import program from "commander";
import fs from "fs";
import glob from "glob";
import makeDir from "make-dir";
import path from "path";
import process from "process";

program
  .name("build")
  .option("-r, --rootDir <dirpath>", "the root of the source directory tree")
  .option("-g, --glob <glob>", "the search within the source directory")
  .option("-o, --outDir <dirpath>", "the root of the output directory tree")
  .option("-m, --minify", "minify the code")
  .option("-c, --compress", "compress the code using brotli")
  .option("-v, --verboseLevel <level>", "higher numbers means more output", parseInt);
program.parse(process.argv);

async function asyncCommandLine(commandLine) {
  return new Promise(function (resolve, reject) {
    exec(commandLine, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      return resolve();
    });
  });
}
async function bundle(inputFilePath, outputFilePath) {
  return asyncCommandLine(`yarn rollup ${inputFilePath} --file ${outputFilePath} --format iife --minifyInternalExport`);
}

async function minify(inputFilePath, outputFilePath) {
  return asyncCommandLine(
    `yarn terser --compress --mangle --mangle-props -- ${inputFilePath} --output ${outputFilePath}`,
  );
}

async function compress(inputFilePath) {
  return asyncCommandLine(`brotli ${inputFilePath}`);
}

async function transpile() {
  return asyncCommandLine(`yarn tgt ${program.minify ? "--minify" : ""}`);
}

async function main() {
  await transpile();
  const globRegex = `${program.rootDir}/${program.glob}`;
  glob(globRegex, {}, function (er, sourceFileNames) {
    sourceFileNames.forEach(async (sourceFileName) => {
      const sourceDirectory = path.dirname(sourceFileName);
      const outputDirectory = sourceDirectory.replace(program.rootDir, program.outDir);

      const sourceExtension = path.extname(sourceFileName);
      const sourceBaseName = path.basename(sourceFileName, sourceExtension);
      const bundledFileName = `${outputDirectory}/${sourceBaseName}.rollup${sourceExtension}`;
      const minifiedFileName = `${outputDirectory}/${sourceBaseName}${sourceExtension}`;
      //const outputFileName = `${outputDirectory}/${sourceBaseName}.${sourceExtension}`;
      if (!fs.existsSync(outputDirectory)) {
        makeDir.sync(outputDirectory);
      }
      await bundle(sourceFileName, bundledFileName);
      sourceFileName = bundledFileName;
      if (program.minify) {
        await minify(sourceFileName, minifiedFileName);
        fs.unlinkSync(sourceFileName);
        sourceFileName = minifiedFileName;
      } else {
        fs.renameSync(sourceFileName, minifiedFileName);
      }

      const compressedFileName = sourceFileName + ".br";
      if (fs.existsSync(compressedFileName)) {
        fs.unlinkSync(sourceFileName + ".br");
      }

      if (program.compress) {
        await compress(sourceFileName);
      }
    });
  });
}

main();
