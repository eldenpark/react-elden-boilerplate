const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');

const config  = require('./webpack.config.client.web');
const CLIENT_PATH = path.resolve(__dirname, '../../src/client');
const SERVER_PATH = path.resolve(__dirname, '../../src/server');
const DIST_SERVER_PATH = path.resolve(__dirname, '../../dist/server');

const serverProdConfig = {
  devtool: 'source-map',
  entry: {
    server: [
      path.resolve(SERVER_PATH, 'server.prod.js'),
    ],
  },
  externals: [
    nodeExternals({
      whitelist: /\.css$/,
    }),
  ],
  mode: 'development',
  optimization: {
    minimize: false,
  },
  output: {
    path: DIST_SERVER_PATH,
    filename: '[name].[hash].js',
    publicPath: '/',
  },
  stats: {
    colors: true,
  },
  target: 'node',
};

module.exports = Object.assign(config, serverProdConfig);
