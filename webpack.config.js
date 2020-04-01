const path = require('path');
const webpack = require('webpack');
const BannerPlugin = webpack.BannerPlugin;

const externals = (function() {
  const manifest = require('./package.json');
  const externals = {};
  Object.keys(manifest.dependencies).forEach((name) => {
    externals[name] = `commonjs ${name}`;
  });
  return externals;
})();

module.exports = {
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
        use: ['babel-loader'],
        exclude: '/node_modules/'
      }
    ]
  },
  plugins: [
    new BannerPlugin({
      banner: '#!/usr/bin/env node\n',
      raw: true
    })
  ]
};
