import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig (
    eslint.configs.recommended,
    tseslint.configs.strict,
    tseslint.configs.stylistic,
    {
        languageOptions: {
            parserOptions: {
                projectService: true
            }
        },
        plugins: {
            '@stylistic': stylistic,
            '@typescript-eslint': tseslint.plugin
        },
        rules: {
            '@stylistic/array-bracket-spacing': [ 'warn', 'always' ],
            '@stylistic/indent': [ 'warn', 4 ],
            '@stylistic/member-delimiter-style': 'warn',
            '@stylistic/no-multi-spaces': [ 'warn' ],
            '@stylistic/object-curly-spacing': [ 'warn', 'always' ],
            '@stylistic/quotes': [ 'warn', 'single', { avoidEscape: true, allowTemplateLiterals: 'avoidEscape' } ],
            '@stylistic/space-before-function-paren': 'warn',
            '@stylistic/type-annotation-spacing': 'warn',
            '@typescript-eslint/no-deprecated': 'warn',
            '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
            '@typescript-eslint/prefer-nullish-coalescing': 'warn',
            '@typescript-eslint/prefer-optional-chain': 'warn',
            'no-console': [ 'warn', { allow: [ 'debug', 'info', 'warn', 'error' ] } ],
            'quote-props': [ 'warn', 'consistent-as-needed' ],
            'semi': [ 'warn', 'always' ],
        }
    }
);
