import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

/**
 * @type {import('eslint').Linter.FlatConfig[]}
 */
export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'comma-dangle': ['warn', 'always-multiline'],
      'curly': 'error',
      'linebreak-style': ['error', 'unix'],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'block-like', next: '*' },
        { blankLine: 'always', prev: '*', next: 'block-like' },
        { blankLine: 'always', prev: '*', next: 'return' },
      ],
      'semi': ['error', 'always'],
      'no-multiple-empty-lines': [
        'error',
        {
          max: 1,
          maxEOF: 1,
        },
      ],
      'object-curly-spacing': ['warn', 'always'],
      'indent': [
        'error',
        2,
        {
          SwitchCase: 1,
          flatTernaryExpressions: true,
        },
      ],
      'quotes': [
        'error',
        'single',
        {
          allowTemplateLiterals: true,
          avoidEscape: true,
        },
      ],
      'camelcase': [
        'error',
        {
          allow: ['^gmail_'],
          properties: 'never',
          ignoreDestructuring: true,
        },
      ],
      'space-before-function-paren': [
        'error',
        {
          asyncArrow: 'always',
          anonymous: 'always',
          named: 'never',
        },
      ],
    },
  },

  {
    files: ['*.test.ts', '*.spec.ts', '*.config.ts'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
];
