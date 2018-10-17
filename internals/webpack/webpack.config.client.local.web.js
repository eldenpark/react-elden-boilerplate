const path = require('path');
const webpack = require('webpack');

const paths = require('../../src/server/paths');
const webpackConfigClientWeb = require('./webpack.config.client.web');

const config = {
  devtool: 'source-map',
  entry: {
    app: [ 
      'webpack-hot-middleware/client', 
      path.resolve(paths.srcClient, 'client.tsx'),
    ],
  },
  mode: 'development',
  optimization: {
    minimize: false,
  },
  output: {
    filename: '[name].[hash].js',
    publicPath: '/bundle/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
};

module.exports = Object.assign({}, webpackConfigClientWeb, config);
