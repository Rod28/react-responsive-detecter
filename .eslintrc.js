/**
 * To review the configuration of this file, as well as add or delete properties,
 * consult the following link.
 *
 * @see https://eslint.org/docs/latest/user-guide/configuring/configuration-files
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
    jest: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'react-app',
    'react-app/jest'
  ],
  plugins: ['react', 'react-hooks'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off', // Enables the use any type
    '@typescript-eslint/no-var-requires': 'off' // Enables the use of require
  },
  ignorePatterns: ['node_modules', 'coverage', 'dist', '.githooks']
};
