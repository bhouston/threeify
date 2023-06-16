import fs from 'node:fs';
import path from 'node:path';
import esbuild from 'esbuild';
import { transpileSource } from './transpileSource';

export const glslTranspiler = {
  name: 'glsl-transpiler',
  setup: (build: esbuild.PluginBuild) => {
    build.onLoad(
      { filter: /\.glsl$/ },
      (args: esbuild.OnLoadArgs): esbuild.OnLoadResult => {
        console.log('args.path', args.path);
        const glslSource = fs.readFileSync(args.path, 'utf8');

        const typescriptSource = transpileSource('', args.path, glslSource);

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

export default glslTranspiler;
