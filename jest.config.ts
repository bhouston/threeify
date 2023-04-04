module.exports = {
  roots: ['<rootDir>/packages/math/src', '<rootDir>/packages/core/src'],
  testMatch: ['**/?(*.)+(spec|test).+(ts|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  resolver: 'ts-jest-resolver'
};
