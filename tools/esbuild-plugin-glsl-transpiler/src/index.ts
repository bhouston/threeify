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
