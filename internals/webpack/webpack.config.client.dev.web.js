const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const config  = require('./webpack.config.client.web');
const CLIENT_PATH = path.resolve(__dirname, '../../src/client');

const devConfig = {
  devtool: 'source-map',
  entry: {
    app: [ 
      'webpack-hot-middleware/client', 
      path.resolve(CLIENT_PATH, 'client.jsx'),
    ],
  },
  mode: 'development',
  optimization: {
    minimize: false,
  },
  output: {
    filename: '[name].[hash].js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
};

module.exports = merge(config, devConfig);
