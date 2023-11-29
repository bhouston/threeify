import fs from 'node:fs';

import esbuild from 'esbuild';

import { transpileSource } from './transpileSource.js';

export const glslTranspiler = {
  name: 'glsl-transpiler',
  setup: (build: esbuild.PluginBuild) => {
    build.onLoad(
      { filter: /\.glsl$/ },
      (args: esbuild.OnLoadArgs): esbuild.OnLoadResult => {
        return {
          contents: transpileSource(
            '',
            args.path,
            fs.readFileSync(args.path, 'utf8')
          ),
          loader: 'js'
        };
      }
    );
  }
};

export default glslTranspiler;
