import type { Config } from 'jest';

// Config data
const coveragePercentage = 90;

/**
 * To review the configuration of this file, as well as add or delete properties,
 * consult the following link.
 *
 * @see https://jestjs.io/docs/configuration
 */
const config: Config = {
  verbose: false,
  transform: {
    '^.+\\.[jt]sx?$': 'ts-jest'
  },
  coverageThreshold: {
    global: {
      branches: coveragePercentage,
      functions: coveragePercentage,
      lines: coveragePercentage,
      statements: -10
    }
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/coverage/',
    '<rootDir>/dist/',
    '<rootDir>/server/',
    '<rootDir>/.githooks/',
    '<rootDir>/src/constants/'
  ],
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/coverage/',
    '<rootDir>/dist/',
    '<rootDir>/server/',
    '<rootDir>/.githooks/'
  ]
};

export default config;
