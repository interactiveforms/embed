import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
  plugins: [
    dts({
      entryRoot: 'src',
      tsconfigPath: path.resolve('tsconfig.lib.json'),
    }),
  ],
  // Dev server configuration
  server: {
    port: 3000,
    host: true, // Allow external connections
    open: true, // Open browser automatically
  },
  // Preview server configuration (for testing built files)
  preview: {
    port: 4173,
    host: true,
  },
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  // Configuration for building your library.
  // See: https://vitejs.dev/guide/build.html#library-mode
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    minify: true,
    lib: {
      entry: 'src/index.ts',
      name: 'InteractiveFormEmbedder',
      fileName: (format) => (format === 'umd' ? 'index.js' : `index.${format}.js`),
      formats: ['umd', 'es'],
    },
  },
});
