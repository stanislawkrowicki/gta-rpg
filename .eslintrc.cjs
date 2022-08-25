module.exports = {
    'env': {
        'browser': true,
        'es2021': true,
        'node': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:svelte/recommended'
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module'
    },
    'overrides': [
        {
            'files': ['*.svelte'],
            'parser': 'svelte-eslint-parser',
            'parserOptions': {
                'parser': '@typescript-eslint/parser'
            }
        }
    ],
    'globals': {
        'alt': true
    },
    'rules': {
        'indent': [
            'error',
            4
        ],
        'semi': [
            'error',
            'never'
        ],
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'no-case-declarations': 'off',
        'no-unused-labels': 'off'
    }
}