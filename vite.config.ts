import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import postcsspxtoviewport from 'postcss-px-to-viewport-8-plugin';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    server: {
        open: false,
        proxy: {
            '/api': {
                target: 'http://localhost:8082',
                rewrite: (path) => path.replace(/^\/api/, '/api'),
                changeOrigin: true,
            },
        },
    },
});
