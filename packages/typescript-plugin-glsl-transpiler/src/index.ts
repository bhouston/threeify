import fs from 'node:fs';
import * as ts from 'typescript';
import { transpileSource } from './transpileSource';

function glslTransformer(context: ts.TransformationContext) {
  console.log('glslTransformer', context);
  return (sourceFile: ts.SourceFile) => {
    if (sourceFile.fileName.endsWith('.glsl')) {
      const glslSource = fs.readFileSync(sourceFile.fileName, 'utf8');

      const typescriptSource = transpileSource(
        '',
        sourceFile.fileName,
        glslSource
      );

      const newSourceFileName = sourceFile.fileName.replace(
        /\.glsl$/,
        '_glsl.ts'
      );
      console.log('transpiling', sourceFile.fileName, 'to', newSourceFileName);
      sourceFile.text = typescriptSource;
      /*
      const transformedSourceFile = ts.createSourceFile(
        newSourceFileName,
        typescriptSource,
        ts.ScriptTarget.Latest,
        true
      );*/
      return sourceFile;
    }
    return sourceFile;
  };
}

export default (program: ts.Program) => {
  return { before: [glslTransformer] };
};
