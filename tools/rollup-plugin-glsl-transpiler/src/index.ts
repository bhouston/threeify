import fs from 'fs/promises';
import path from 'path';
import { Plugin } from 'rollup';

import { transpileSource } from './transpileSource.js';

export default function glslTranspiler(): Plugin {
  return {
    name: 'glsl-transpiler',

    async load(id: string) {
      if (!id.match(/\.glsl$/)) return null;

      const parsedPath = path.parse(id);

      const glslSource = await fs.readFile(id, 'utf-8');
      const jsSource = transpileSource(
        parsedPath.dir,
        parsedPath.base,
        glslSource
      );

      return jsSource;
    },

    transform(code: string, id: string) {
      if (!id.match(/\.glsl$/)) return null;

      return {
        code,
        map: { mappings: '' }
      };
    }
  };
}
