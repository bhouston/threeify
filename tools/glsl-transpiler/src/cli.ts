const entrypoint = import.meta.url.endsWith('.ts') ? './index.ts' : './index.js';
const { main } = (await import(entrypoint)) as { main: () => Promise<void> | void };

await main();