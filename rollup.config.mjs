import { defineConfig } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import { dts } from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';
import filesize from 'rollup-plugin-filesize';

// Package
const pkg = require('./package.json');

// Dist
const outputDir = 'dist';

/**
 * To review the configuration of this file, as well as add or delete properties,
 * consult the following link.
 *
 * @see https://rollupjs.org/introduction/
 */
const config = defineConfig([
  {
    input: 'src/index.tsx',
    output: [
      // Nodejs
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
        exports: 'default'
      },
      // ES6
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true
      }
    ],
    external: ['react', 'react-dom', 'local-storage-to-object'],
    plugins: [
      // If commonjs() is used, babel should go below this function
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: /node_modules/,
        extensions: ['.ts', '.tsx']
      }),
      nodeResolve({ extensions: ['.ts', '.tsx'] }),
      typescript({ tsconfig: './tsconfig.json' }),
      postcss({
        // extract: true, //Extract CSS to the same location where JS file is generated but with .css extension.
        inject: true, // Inject CSS into <head>, it's always false when extract: true.
        sourceMap: true,
        minimize: true,
        extensions: ['.css', '.scss']
      }),
      terser(),
      filesize()
    ]
  },
  {
    input: `${outputDir}/es/index.d.ts`,
    output: { file: pkg.types, format: 'es', sourcemap: true },
    external: [/\.s?css$/i], // Ignore .scss & .css files
    plugins: [dts()]
  }
]);

export default config;
