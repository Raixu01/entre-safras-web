import js from '@eslint/js';
import ts from 'typescript-eslint';
export default ts.config({ ignores: ['dist/**', 'work/**', 'node_modules/**', 'playwright-report/**', 'test-results/**'] }, js.configs.recommended, ...ts.configs.recommended, { files: ['scripts/*.mjs'], languageOptions: { globals: Object.fromEntries(['process','URL','localStorage','navigator','window','Storage','document','console','Buffer','setTimeout'].map(key => [key, 'readonly'])) } }, { files: ['**/*.ts'], rules: { '@typescript-eslint/no-non-null-assertion': 'off' } });

