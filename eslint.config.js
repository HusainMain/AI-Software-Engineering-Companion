import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist', 'dist-electron', 'release', 'node_modules'],
  },
  js.configs.recommended,
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.electron.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['*.js', '*.ts'],
    extends: [tseslint.configs.disableTypeChecked],
  },
  eslintConfigPrettier,
);
