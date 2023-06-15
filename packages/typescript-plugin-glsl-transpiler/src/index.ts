import fs from 'node:fs';
import path from 'node:path';
import * as ts from 'typescript';
import { transpileSource } from './transpileSource';

export const glslTranspiler = {
  name: 'glsl-transpiler',
  setup: (build: esbuild.PluginBuild) => {
    build.onLoad(
      { filter: /\.glsl$/ },
      async (args: esbuild.OnLoadArgs): Promise<esbuild.OnLoadResult> => {
        console.log('args.path', args.path);
        const glslSource = fs.readFileSync(args.path, 'utf8');

        const typescriptSource = await transpileSource(
          '',
          args.path,
          glslSource
        );

        //fs.writeFileSync(args.path + '.js.test', typescriptSource, 'utf8');

        return {
          // If you want TypeScript, change `contents` to: `export default \`${shaderSource}\`;`
          contents: typescriptSource,
          loader: 'js'
        };
      }
    );
  }
};

function glslTransformer(context: ts.TransformationContext) {
  return (sourceFile: ts.SourceFile) => {
    if (sourceFile.fileName.endsWith('.glsl')) {
      const glslSource = fs.readFileSync(sourceFile.fileName, 'utf8');

      const typescriptSource = transpileSource(
        '',
        sourceFile.fileName,
        glslSource
      );

      const transformedSourceFile = ts.createSourceFile(
        sourceFile.fileName.replace(/\.glsl$/, '_glsl.ts'),
        typescriptSource,
        ts.ScriptTarget.Latest,
        true
      );
      return transformedSourceFile;
    }
    return sourceFile;
  };
}

export default (program: ts.Program) => {
  return { before: [glslTransformer] };
};
