/* eslint-disable @typescript-eslint/no-var-requires */

import path from 'path';
import config from './base.conf';
import webpack from 'webpack';

const { merge } = require('webpack-merge');


export default merge(config, <webpack.Configuration>{
  entry: path.resolve(__dirname, '../../samples/index.tsx'),
  mode: 'production',
  output: {
    filename: 'test.bundle.js',
    path: path.resolve(__dirname, '../../dist'),
  }
});
