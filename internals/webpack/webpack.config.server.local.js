const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const path = require('path');

const clientConfig = require('./webpack.config.client.web');
const paths = require('./paths');

const serverProdConfig = {
  devtool: 'source-map',
  entry: {
    server: [
      path.join(paths.srcServer, 'server.local.js'),
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
    path: paths.distServer,
    filename: 'server.local.js',
    publicPath: '/',
  },
  stats: {
    colors: true,
  },
  target: 'node',
};

module.exports = Object.assign(clientConfig, serverProdConfig);
