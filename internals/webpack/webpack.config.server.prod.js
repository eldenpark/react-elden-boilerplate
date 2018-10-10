const nodeExternals = require('webpack-node-externals');
const path = require('path');

const paths = require('../../src/server/paths');
const webpackConfigClientWeb = require('./webpack.config.client.web');

const config = {
  devtool: 'source-map',
  entry: {
    server: [
      path.join(paths.srcServer, 'server.prod.js'),
    ],
  },
  externals: [
    nodeExternals({
      whitelist: /\.css$/,
    }),
  ],
  mode: 'development',
  node: {
    __dirname: false,
  },
  optimization: {
    minimize: false,
  },
  output: {
    filename: 'server.prod.js',
    library: '',
    libraryTarget: 'commonjs',
    path: paths.distServer,
    publicPath: '/',
  },
  stats: {
    colors: true,
  },
  target: 'node',
};

module.exports = Object.assign({}, webpackConfigClientWeb, config);
