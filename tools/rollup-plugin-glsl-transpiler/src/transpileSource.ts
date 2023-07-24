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

export function transpileSource(
  rootDir: string,
  glslSourceFileName: string,
  glslSource: string
): string {
  // create a list of imports
  const importNamesToPaths: Map<string, string> = new Map();

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
      glslSourceFileName.replace(rootDir, '')
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
    if (importPath.includes('/dist/') || importPath.includes('@')) {
      importPath += '';
    }
    tsSource += `import ${importName} from '${importPath}';\n`;
  });

  tsSource += '\n';

  // add the export
  tsSource += 'export default ' + jsLiteral + ';';

  // get path from filename
  return tsSource;
}
