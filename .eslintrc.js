const { off } = require("./app");

module.exports = {
  env: {
    commonjs: true,
    es2020: true,
    node: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
  },
  overrides: {
      rules: {
          'no-undef': 'off',
      }
  }
};
