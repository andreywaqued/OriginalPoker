import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import stub from 'rollup-plugin-stub';

export default {
  input: './build/index.js',
  output: {
    file: './buildConverted/index.js',
    format: 'cjs'
  },
  external: [
    'fs',
    'path',
    'http',
    'url',
    'util',
    'os',
    // ... add other Node.js built-ins as needed
  ],
  plugins: [
    stub(),
    commonjs(),
    resolve({ 
      preferBuiltins: true, 
      browser: false 
    }),
    nodePolyfills()
  ]
};
