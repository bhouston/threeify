/* eslint-disable unicorn/prefer-string-replace-all */
// take a glsl file and transpilte it into a typescript file
//
// the glsl file defines imports using a typescript like syntax in this fashion:
//  #pragma import <es-module-path or local-file-path>
//
// The output of the transpiler will be in typescript.
// It will contain all the imports it found first
// then it will use javascript literals to contain the glsl code
// the import will be referenced within the javascript literal
// the default and only export will be a javascript literal containing the glsl code
//

import { promises as fsPromises } from 'node:fs';
import fs from 'node:fs';
import path from 'node:path';

import { Options } from './options.js';

// matches with //  #pragma import <es-module-path or local-file-path>
const importRegex = /^#pragma import "(?<path>[^\n"]+)"$/gm;

function pathToVariableName(path: string): string {
  const variableName = path
    .replace(/@/g, '_')
    .replace(/\//g, '_')
    .replace(/\./g, '_')
    .replace(/.glsl/g, '')
    .replace(/_+/g, '_');
  // console.log('pathToVariableName', path, variableName);
  return variableName;
}

export async function transpile(
  glslSourceFileName: string,
  typeScriptOutputFileName: string,
  options: Options
): Promise<void> {
  // create a list of imports
  const importNamesToPaths: Map<string, string> = new Map();

  // read the glsl file
  //console.log('reading glsl source file', glslSourceFileName);
  let glslSource = await fsPromises.readFile(glslSourceFileName, 'utf-8');

  // for each match of the import regex, add the import to the list of imports, and remove the import from the glsl source
  // and insert the expected variable into the javascript literal.
  // the expected variable is the name of the file without the extension
  // for example, if the import is #pragma import './my-shader.glsl'

  glslSource = glslSource.replace(
    importRegex,
    (match: string, importPath: string, other: string) => {
      // console.log(
      //   `replacement match:${match} importPath:${importPath} other:${other}`
      //  );

      // convert the import path to a variable name
      const importName = pathToVariableName(importPath);

      // add the import to the list of imports
      importNamesToPaths.set(importName, importPath);

      // replace the import from the glsl source with the expected import name
      return '${' + importName + '}';
    }
  );

  if (glslSource.includes('#pragma once')) {
    // convert the import path to a variable name
    const includeGuardName = pathToVariableName(
      glslSourceFileName.replace(options.rootDir, '')
    );

    const includeGuardPrefix = `#ifndef ${includeGuardName}\n#define ${includeGuardName}\n`;
    const includeGuardPostfix = `\n\n#endif // end of include guard`;

    glslSource =
      includeGuardPrefix +
      glslSource.replace(/#pragma once/gm, '') +
      '\n' +
      includeGuardPostfix;
  }

  // create the javascript literal
  const jsLiteral = '`' + glslSource + '`';

  // create the typescript source
  let tsSource = '';

  // add the imports
  importNamesToPaths.forEach((importPath, importName) => {
    tsSource += `import ${importName} from '${importPath}.js';\n`;
  });

  tsSource += '\n';

  // add the export
  tsSource += 'export default ' + jsLiteral + ';';

  // get path from filename
  const outDir = path.dirname(typeScriptOutputFileName);

  // make directory if required
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  // write the typescript source to the output file
  // console.log('writing typescript source file', typeScriptOutputFileName);
  await fsPromises.writeFile(typeScriptOutputFileName, tsSource);
}
