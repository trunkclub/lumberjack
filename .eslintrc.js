module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  extends: [
    'standard',
    'plugin:jsdoc/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module"
  },
  plugins: [
    'jsdoc'
  ],
  rules: {
    'no-trailing-spaces': [
      "error",
      { "ignoreComments": true }
    ],
    'comma-dangle': [
      "error",
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'never',
        exports: 'never',
        functions: 'never',
      },
    ],
    '@typescript-eslint/member-delimiter-style': [
      "error",
      {
        multiline: {
          delimiter: 'none',
        },
      }
    ]
  }
}
