#!/usr/bin/env node

const nodeMajorVersion = Number.parseInt(process.versions.node.split('.')[0], 10);

if (nodeMajorVersion >= 24) {
	await import('../src/cli.ts');
} else {
	await import('../dist/cli.js');
}
