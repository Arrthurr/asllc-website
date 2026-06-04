import js from '@eslint/js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tailwind from 'eslint-plugin-tailwindcss';
import tseslint from 'typescript-eslint';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
  { ignores: ['dist', 'e2e', 'playwright.config.ts', '.amp/**', 'postcss.config.js', 'tailwind.config.js'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    files: ['src/**/*.{tsx,jsx}'],
    extends: [...tailwind.configs['flat/recommended']],
    settings: {
      tailwindcss: {
        config: path.join(__dirname, 'tailwind.config.js'),
      },
    },
    rules: {
      'tailwindcss/classnames-order': 'warn',
      'tailwindcss/enforces-shorthand': 'off',
      'tailwindcss/no-custom-classname': 'off',
    },
  }
);
