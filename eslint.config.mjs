import pluginJs from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  {
    ignores: ['dist/**/*', 'node_modules/**/*'],
  },
  {
    languageOptions: { globals: { ...globals.browser } },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.{config,setup}.{js,mjs,cjs,ts}'],
        },
      },
    },
  },
  {
    rules: {
      eqeqeq: 'error',
      'no-duplicate-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/switch-exhaustiveness-check': [
        'warn',
        { considerDefaultExhaustiveForUnions: true },
      ],
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        {
          allowAny: false,
          allowNullableBoolean: false,
          allowNullableEnum: false,
          allowNullableNumber: false,
          allowNullableObject: false,
          allowNullableString: false,
          allowNumber: false,
          allowString: false,
        },
      ],
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: false },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
    },
  },
  {
    plugins: { import: importPlugin },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
    rules: {
      'import/order': [
        'warn',
        {
          'newlines-between': 'always',
          named: true,
          alphabetize: { order: 'asc' },
        },
      ],
    },
  },
  // {
  //   files: ['**/*.test.ts'],
  //   ...vitest.configs.recommended,
  //   rules: {
  //     ...vitest.configs.recommended.rules,
  //     '@typescript-eslint/no-explicit-any': 'off',
  //     '@typescript-eslint/no-unsafe-assignment': 'off',
  //     '@typescript-eslint/no-unsafe-member-access': 'off',
  //   },
  // },
  prettierConfig,
  // Re-enables curly braces for all statements after Prettier config
  {
    rules: {
      curly: ['error', 'all'],
    },
  },
];
