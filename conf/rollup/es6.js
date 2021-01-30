import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import base from './base';


export default Object.assign(base, {
  plugins: [
    commonjs(),
    terser(),
    nodeResolve(),
  ],
  output: [
    Object.assign(base.output, {
      file: 'dist/bundles/react-callbag-streams.es6.min.js',
    }),
    {
      file: 'dist/bundles/react-callbag-streams.es.min.js',
      format: 'es'
    }
  ]
});
