import viteCommonjs from 'vite-plugin-commonjs';
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';

export default defineConfig({
    plugins: [viteCommonjs()],
    test: {
        globals: true,
        environment: 'node',
        exclude: [...configDefaults.exclude, 'node_modules/**'],
    },
});
