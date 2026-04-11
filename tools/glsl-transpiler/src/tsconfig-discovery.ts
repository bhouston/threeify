import { promises as fsPromises } from 'node:fs';
import fs from 'node:fs';
import path from 'node:path';

export type BuildProject = {
  tsconfigPath: string;
  projectDir: string;
  rootDir: string;
  outDir: string;
};

type TsConfigReference = {
  path: string;
};

type TsConfig = {
  references?: TsConfigReference[];
  include?: string[];
  compilerOptions?: {
    rootDir?: string;
    outDir?: string;
  };
  glslTranspiler?: {
    rootDir?: string;
    outDir?: string;
  };
};

function stripJsonComments(input: string): string {
  return input
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
    .replace(/,\s*([}\]])/g, '$1');
}

async function loadTsConfig(tsconfigPath: string): Promise<TsConfig> {
  if (!fs.existsSync(tsconfigPath)) {
    throw new Error(`tsconfig does not exist: ${tsconfigPath}`);
  }

  const source = await fsPromises.readFile(tsconfigPath, 'utf-8');
  const parsed = JSON.parse(stripJsonComments(source)) as TsConfig;
  return parsed;
}

function resolveReferencePath(parentConfigPath: string, referencePath: string): string {
  const parentDir = path.dirname(parentConfigPath);
  const resolvedPath = path.resolve(parentDir, referencePath);

  if (path.extname(resolvedPath) === '.json') {
    return resolvedPath;
  }

  return path.join(resolvedPath, 'tsconfig.json');
}

function inferRootDir(config: TsConfig): string {
  if (config.glslTranspiler?.rootDir) {
    return config.glslTranspiler.rootDir;
  }

  if (config.compilerOptions?.rootDir) {
    return config.compilerOptions.rootDir;
  }

  if (config.include?.some((entry) => entry.startsWith('src'))) {
    return 'src';
  }

  return 'src';
}

function inferOutDir(config: TsConfig, rootDir: string): string {
  if (config.glslTranspiler?.outDir) {
    return config.glslTranspiler.outDir;
  }

  return rootDir;
}

export async function discoverBuildProjects(rootTsconfigPath: string): Promise<BuildProject[]> {
  const orderedConfigPaths: string[] = [];
  const visiting = new Set<string>();
  const visited = new Set<string>();

  async function dfs(tsconfigPath: string): Promise<void> {
    const normalizedPath = path.resolve(tsconfigPath);

    if (visiting.has(normalizedPath)) {
      throw new Error(`circular tsconfig references detected at ${normalizedPath}`);
    }

    if (visited.has(normalizedPath)) {
      return;
    }

    visiting.add(normalizedPath);

    const config = await loadTsConfig(normalizedPath);
    const references = config.references || [];

    for (const reference of references) {
      const referencedConfigPath = resolveReferencePath(normalizedPath, reference.path);
      await dfs(referencedConfigPath);
    }

    visiting.delete(normalizedPath);
    visited.add(normalizedPath);
    orderedConfigPaths.push(normalizedPath);
  }

  await dfs(rootTsconfigPath);

  const projects: BuildProject[] = [];

  for (const tsconfigPath of orderedConfigPaths) {
    const config = await loadTsConfig(tsconfigPath);
    const projectDir = path.dirname(tsconfigPath);
    const rootDir = inferRootDir(config);
    const outDir = inferOutDir(config, rootDir);

    projects.push({
      tsconfigPath,
      projectDir,
      rootDir,
      outDir,
    });
  }

  return projects;
}