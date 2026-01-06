import baseConfig from 'eslint-config-loderunner/base';
import formattingConfig from 'eslint-config-loderunner/formatting';
import importConfig from 'eslint-config-loderunner/import';
import jsdocConfig from 'eslint-config-loderunner/jsdoc';
import typescriptConfig from 'eslint-config-loderunner/typescript';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  {
    ignores: ['dist/**/*', 'node_modules/**/*'],
  },
  {
    languageOptions: { globals: { ...globals.browser } },
  },
  ...baseConfig,
  ...typescriptConfig,
  ...importConfig,
  ...jsdocConfig,
  ...formattingConfig,
];
