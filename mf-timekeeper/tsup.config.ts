import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['cjs', 'esm'],
  target: 'es6',
  dts: true, // Generate TypeScript declaration files
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: true,
});