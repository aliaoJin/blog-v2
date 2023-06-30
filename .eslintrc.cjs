module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        // 'plugin:vue/vue3-essential',
        // 'eslint:recommended',
        // '@vue/typescript/recommended',
        // '@vue/prettier',
        // '@vue/prettier/@typescript-eslint',
        // 'plugin:prettier/recommended',

        'plugin:vue/vue3-essential',
        'eslint:recommended',
        '@vue/typescript/recommended',
        '@vue/prettier',
        '@vue/eslint-config-typescript',
    ],
    plugins: ['eslint-plugin-prettier'],
    parserOptions: {
        parsar: '@typescript-eslint/parsar',
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        endOfLine: 'auto',
    },
};
