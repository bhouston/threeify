import fs, { Dirent, promises as fsPromises } from 'fs';
import path from 'path';

export type ExampleDescription = {
  name: string;
  path: string;
  description?: string;
  keywords: string[];
};

type ExampleJSON = {
  slug?: string;
  name?: string;
  theme?: 'light' | 'dark';
  description?: string;
  keywords?: string[];
};

export const getExampleDescriptions = async (rootPath: string) => {
  console.log('rootPath', rootPath);
  // this code scan all sub directories looking for files named example.json
  const dirEntries = await fsPromises.readdir(rootPath, {
    withFileTypes: true
  });
  const examples: ExampleDescription[] = [];
  const files = dirEntries.filter((dirent) => dirent.isFile());
  files.forEach((file) => {
    console.log('file.name', file.name, 'file.path', file.path);
    if (file.name === 'index.ts') {
      const example: ExampleDescription = {
        name: file.name,
        path: file.path.replace(rootPath, '') + '/' + file.name,
        keywords: []
      };
      const jsonFile = path.join(file.path, 'example.json');
      if (fs.existsSync(jsonFile)) {
        const json = JSON.parse(
          fs.readFileSync(jsonFile, 'utf8')
        ) as ExampleJSON;
        if (json.name) {
          example.name = json.name;
        }
        if (example.description) {
          example.description = json.description;
        }
        if (json.keywords) {
          example.keywords.push(...json.keywords);
        }
      }
      console.log(JSON.stringify(example, null, 2));
      examples.push(example);
    }
  });
  return examples;
};
