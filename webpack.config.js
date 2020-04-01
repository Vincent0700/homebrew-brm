const path = require('path');
const webpack = require('webpack');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

const externals = (function() {
  const manifest = require('./package.json');
  const externals = {};
  Object.keys(manifest.dependencies).forEach((name) => {
    externals[name] = `commonjs ${name}`;
  });
  return externals;
})();

const config = {
  mode: 'production',
  entry: {
    app: path.resolve(__dirname, './cli.js')
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index.js'
  },
  externals: externals,
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['cache-loader', 'babel-loader'],
        include: [path.resolve(__dirname, './cli.js')]
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: '#!/usr/bin/env node\n',
      raw: true
    })
  ]
};

module.exports = new SpeedMeasurePlugin().wrap(config);
