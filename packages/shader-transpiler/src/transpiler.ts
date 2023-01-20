import fs from 'node:fs';
import path from 'node:path';

import makeDir from 'make-dir';

import {
  stripComments,
  stripUnnecessaryLineEndings,
  stripUnnecessarySpaces
} from './minification.js';

const includeLocalRegex = /^[\t ]*#(?:pragma +)?include +"([\w./]+)"/gm; // modified from three.js
const includeAbsoluteRegex = /^[\t ]*#(?:pragma +)?include +<([\w./]+)>/gm; // modified from three.js
const jsModulePrefix = 'export default /* glsl */ `\n';
const jsModulePostfix = '`;\n';

export function glslToJavaScriptTranspiler(
  sourceFileName: string,
  outputFileName: string,
  options: any
) {
  const sourcePath = path.dirname(sourceFileName);
  const sourceCode = fs.readFileSync(sourceFileName, 'utf8');

  const includeGuardName = sourceFileName
    .replace(options.rootDir, '')
    .replace(/[./_]/gm, '_');

  const includeImports: string[] = [];

  const errors: string[] = [];

  const searchExtensions = options.extensions.map(
    (extension: string) => '.' + extension
  );
  searchExtensions.push('');

  if (options.allowJSIncludes) {
    searchExtensions.slice(0).forEach((extension: string) => {
      searchExtensions.push(extension + '.ts', extension + '.js');
    });
  }

  function includeReplacer(searchDirectories: string[]) {
    return function (match: string, sourceFileName: string) {
      //console.log(
      //  '-----------------------------------------------------------------------'
      //);
      //console.log('resolving:', match);
      //console.log(`sourceFileName ${sourceFileName}`);
      if (!sourceFileName) return '';

      /*if (includeFileName.indexOf(".glsl") < 0) {
      // auto add glsl extension if it is missing.
      includeFileName += ".glsl";
    }*/

      const directories = searchDirectories.slice(0);
      // directories.push(sourcePath);

      const pathsAttempted: string[] = [];
      let includeFilePath = '';
      directories.forEach((directory: string) => {
        const testIncludeFilePath = path.normalize(
          path.join(directory, sourceFileName)
        );
        searchExtensions.forEach((extension: string) => {
          const test2IncludeFilePath = testIncludeFilePath + extension;
          pathsAttempted.push(test2IncludeFilePath);
          if (fs.existsSync(test2IncludeFilePath)) {
            includeFilePath = test2IncludeFilePath;
          }
        });
      });

      //console.log( `includeFilePath ${includeFilePath}` );

      if (includeFilePath.length === 0) {
        const errorMsg = `Could not resolve "${match}" - current directory ${sourcePath}, attempts: ${pathsAttempted.join(
          ','
        )}`;
        //console.error(errorMsg);
        errors.push(errorMsg);
        return errorMsg;
      }

      const includeVar = includeFilePath
        .replace(options.rootDir, '')
        .replace(/[./_]/gm, '_');
      let relativeIncludePath = path.relative(sourcePath, includeFilePath);
      if (relativeIncludePath.indexOf('.') !== 0) {
        relativeIncludePath = './' + relativeIncludePath;
      }
      relativeIncludePath = relativeIncludePath.replace(/.js$/, '');
      const includeImport = `import ${includeVar} from '${relativeIncludePath}.js';`;
      if (!includeImports.includes(includeImport)) {
        // handle multiple imports of the same file
        includeImports.push(includeImport);
      }
      const result = '${' + includeVar + '}';
      //console.log('result:', result);
      return result;
    };
  }

  let outputSource = sourceCode;

  if (options.minify) {
    outputSource = stripComments(outputSource);
    outputSource = stripUnnecessaryLineEndings(outputSource);
    outputSource = stripUnnecessarySpaces(outputSource);
  }

  if (sourceCode.includes('#pragma once')) {
    const includeGuardPrefix = `#ifndef ${includeGuardName}\n#define ${includeGuardName}\n`;
    const includeGuardPostfix = `\n\n#endif // end of include guard`;

    outputSource =
      includeGuardPrefix +
      outputSource.replace(/#pragma once/gm, '') +
      '\n' +
      includeGuardPostfix;
  }

  outputSource = outputSource.replace(
    includeLocalRegex,
    includeReplacer([sourcePath])
  );

  outputSource = outputSource.replace(
    includeAbsoluteRegex,
    includeReplacer([options.rootDir].concat(options.includeDirs))
  );

  let outputModule = includeImports.join('\n');
  if (outputModule.length > 0) {
    outputModule += '\n\n';
  }
  outputModule += jsModulePrefix + outputSource + '\n' + jsModulePostfix;

  const outputPath = path.dirname(outputFileName);
  if (!fs.existsSync(outputPath)) {
    makeDir.sync(outputPath);
  }
  fs.writeFileSync(outputFileName, outputModule);

  return errors;
}
