import { exec } from "child_process";
import program from "commander";
import fs from "fs";
import glob from "glob";
import makeDir from "make-dir";
import path from "path";
import process from "process";
import puppeteer from "puppeteer";

program
  .name("build")
  .option("-o, --outDir <dirpath>", "the root of the output directory tree")
  .option("-m, --minify", "minify the code")
  .option("-c, --compress", "compress the code using brotli")
  .option("-s, --screenshot", "re-generate the screenshots")
  .option("-v, --verboseLevel <level>", "higher numbers means more output", parseInt);
program.parse(process.argv);

const rootDir = "./dist";
const sourceDir = "./src";
const assetDir = "./assets";

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

function fileSize(filePath) {
  return fs.statSync(filePath).size;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  await transpile();

  const distJSGlob = `${rootDir}/**/index.js`;
  glob(distJSGlob, {}, async function (er, inputFileNames) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    for (let i = 0; i < inputFileNames.length; i++) {
      let inputFileName = inputFileNames[i];
      try {
        const inputDirectory = path.dirname(inputFileName);
        const outputDirectory = inputDirectory.replace(rootDir, program.outDir + "/examples");
        const sourceDirectory = inputDirectory.replace(rootDir, sourceDir);

        const name = inputDirectory.replace(rootDir, "").replace("/examples/", "");

        const extension = path.extname(inputFileName);
        const baseName = path.basename(inputFileName, extension);
        const bundledFileName = `${outputDirectory}/${baseName}.rollup${extension}`;
        const minifiedFileName = `${outputDirectory}/${baseName}${extension}`;

        //const outputFileName = `${outputDirectory}/${sourceBaseName}.${sourceExtension}`;
        if (!fs.existsSync(outputDirectory)) {
          makeDir.sync(outputDirectory);
        }
        await bundle(inputFileName, bundledFileName);
        const bundledFileSize = fileSize(bundledFileName);
        inputFileName = bundledFileName;
        let minifiedFileSize = undefined;
        if (program.minify) {
          await minify(inputFileName, minifiedFileName);
          fs.unlinkSync(inputFileName);
          inputFileName = minifiedFileName;
          minifiedFileSize = fileSize(minifiedFileName);
        } else {
          fs.renameSync(inputFileName, minifiedFileName);
        }

        const compressedFileName = inputFileName + ".br";
        if (fs.existsSync(compressedFileName)) {
          fs.unlinkSync(compressedFileName);
        }
        let compressedFileSize = undefined;
        if (program.compress) {
          await compress(inputFileName);
          compressedFileSize = fileSize(inputFileName + ".br");
        }

        const sourceJson = "./" + path.join(sourceDirectory, "example.json");
        if (fs.existsSync(sourceJson)) {
          const outputJson = path.join("./" + outputDirectory, "example.json");
          const json = JSON.parse(fs.readFileSync(sourceJson));
          json.bundleSize = bundledFileSize;
          if (minifiedFileSize !== undefined) {
            json.minifiedSize = minifiedFileSize;
          }
          if (compressedFileSize) {
            json.compressedFileSize = compressedFileSize;
          }
          fs.writeFileSync(outputJson, JSON.stringify(json));

          if (program.screenshot) {
            await page.goto(`http://localhost:8000/examples?name=${name}`);

            let canvas = null;
            while (canvas === null) {
              canvas = await page.$("canvas");
              await sleep(200);
            }

            await sleep(500);

            const screenshotPath = `${program.outDir}/assets/thumbnails/${json.slug}.png`;
            const screenshotDir = path.dirname(screenshotPath);
            if (!fs.existsSync(screenshotDir)) {
              makeDir.sync(screenshotDir);
            }
            await canvas.screenshot({ path: screenshotPath });
          }
        }
      } catch (e) {
        console.log(" ERROR ", e);
      }
    }
    await browser.close();
  });

  const brotliExtensions = ["obj", "hdr", "mtl", "ply", "glTF", "glb"];
  const assetsGlob = `${assetDir}/**/*.*`;
  glob(assetsGlob, {}, function (er, inputFileNames) {
    inputFileNames.forEach(async (inputFileName) => {
      const inputDirectory = path.dirname(inputFileName);
      const outputDirectory = inputDirectory.replace(assetDir, program.outDir + "/assets");

      const extension = path.extname(inputFileName);
      const baseName = path.basename(inputFileName, extension);
      const outputFileName = `${outputDirectory}/${baseName}${extension}`;

      if (!fs.existsSync(outputDirectory)) {
        makeDir.sync(outputDirectory);
      }
      if (fs.existsSync(outputFileName)) {
        fs.unlinkSync(outputFileName);
      }
      fs.copyFileSync(inputFileName, outputFileName);

      if (brotliExtensions.indexOf(extension.slice(1)) >= 0) {
        const compressedFileName = outputFileName + ".br";
        if (fs.existsSync(compressedFileName)) {
          fs.unlinkSync(compressedFileName);
        }
        if (program.compress) {
          await compress(outputFileName);
        }
      }
    });
  });
}

main();
