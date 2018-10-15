const nodeExternals = require('webpack-node-externals');
const path = require('path');

const paths = require('../../src/server/paths');
const webpackConfigClientWeb = require('./webpack.config.client.web');

const config = {
  devtool: 'source-map',
  entry: {
    rootContainer: path.join(paths.srcClient, 'containers/app/RootContainer/RootContainer.web.tsx'),
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
    filename: 'server.local.[name].js',
    library: '',
    libraryTarget: 'commonjs',
    publicPath: '/',
  },
  stats: {
    colors: true,
  },
  target: 'node',
};

module.exports = Object.assign({}, webpackConfigClientWeb, config);
