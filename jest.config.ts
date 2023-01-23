export default {
  projects: [
    {
      name: 'core',
      displayName: '@threeify/core',
      preset: 'ts-jest',
      testEnvironment: 'node',
      rootDir: './',
      resolver: 'ts-jest-resolver',
      testMatch: ['<rootDir>/packages/core/src/**/*.test.ts']
    },
    {
      name: 'scene',
      displayName: '@threeify/scene',
      preset: 'ts-jest',
      testEnvironment: 'node',
      rootDir: './',
      resolver: 'ts-jest-resolver',
      testMatch: ['<rootDir>/packages/scene/src/**/*.test.ts']
    }
  ]
};
