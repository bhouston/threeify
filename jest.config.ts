export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  resolver: 'ts-jest-resolver',
  testMatch: ['<rootDir>/packages/*/src/**/*.test.ts']
};
