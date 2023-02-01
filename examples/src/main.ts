import fs from 'node:fs';
import path from 'node:path';

type ExampleInfoJson = {
  name: string;
  description: string;
  keywords: string[];
};
type ExampleJson = {
  slug: string;
  theme: 'dark' | 'light';
  en: ExampleInfoJson;
};

function getExamplesJson(rootPath: string, slugPrefix: string) {
  const examples: {
    name: string;
    slug: string;
    theme: 'dark' | 'light';
    description: string;
    keywords: string[];
  }[] = [];
  const exampleSlugs = new Set<string>();

  const readDirectory = (directory: string) => {
    fs.readdirSync(directory).forEach((file) => {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        readDirectory(filePath);
      } else if (file === 'example.json') {
        const example = JSON.parse(
          fs.readFileSync(filePath, 'utf8')
        ) as unknown as ExampleJson;
        const slug = path.relative(slugPrefix, directory);
        if (exampleSlugs.has(slug))
          throw new Error(`Duplicate example slug: ${slug} in folder ${slug}`);
        exampleSlugs.add(example.slug);

        examples.push({
          slug: slug,
          theme: example.theme,
          ...example.en
        });
      }
    });
  };

  readDirectory(rootPath);
  return examples;
}

const examplesJson = getExamplesJson('.', './src/examples');
fs.writeFileSync('examples.json', JSON.stringify(examplesJson, null, 2));
