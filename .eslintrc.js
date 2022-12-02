module.exports = {
  env: {
    browser: false,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
    'prettier',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/camelcase': 'off',
    'import/no-duplicates': 'error',
    'import/named': 'off', // for lodash
    'import/namespace': 'off', // for aws-sdk
    'import/order': [2, { 'alphabetize': { 'order': 'asc' } }], // to auto fix import order
    'no-constant-condition': ['error', { checkLoops: false }], // to allow "while(true)"
    'sort-imports': 0, // sort-imports does not auto fix
    'import/export': 'off',
  },
  settings: {
    'import/extensions': ['.js', '.ts'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      typescript: {},
    },
  },
};
