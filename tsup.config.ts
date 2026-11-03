import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true, // single bundled index.d.ts
  minify: true, // esbuild minify
  treeshake: true,
  sourcemap: false, // no .map files in the published package
  clean: true,
  external: ['react', 'react-dom'],
  outExtension({ format }) {
    return { js: format === 'esm' ? '.mjs' : '.js' };
  },
});
