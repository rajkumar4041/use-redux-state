/* used to create absolute file paths (cross-platform safe).*/
import path from 'path';
/* helper function that provides better TypeScript support when writing config.*/
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      // define the entry point for the library
      entry: path.resolve(__dirname, 'src/index.ts'),
      // name of the library, used in UMD builds
      name: 'useReduxState',
      // output formats for the library
      formats: ['cjs', 'es'],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      //         Marks these packages as external, meaning they won’t be bundled into your final output.
      // This keeps your package lean and avoids duplicating dependencies in users' apps.
      external: ['react', 'react-dom', 'react-redux', '@reduxjs/toolkit'],
      output: {
        sourcemap: true,
      },
    },
    // This is where you can specify how the library should be minified.
    // 'terser' is a popular minifier that works well with modern JavaScript.
    minify: 'terser',
  },
});
