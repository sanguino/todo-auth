module.exports = {
  env: {
    es6: true,
    node: true,
    mocha: true,
  },
  extends: ['airbnb-base'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/test/**/*.js'],
      },
    ],
    'arrow-parens': ['error', 'as-needed'],
  },
  overrides: [
    {
      files: ['**/test/**/*.js'],
      rules: {
        'no-console': 'off',
        'no-unused-expressions': 'off',
      },
    },
  ],
};
