const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin')

const APP_PATH = path.resolve(__dirname, '../../src/app');
const DIST_PATH = path.resolve(__dirname, '../../dist');
const INDEX_PATH = path.resolve(__dirname, './static/index.html');

module.exports = {
  context: __dirname,
  entry: {
    app: path.resolve(APP_PATH, 'app.jsx'),
    react: [ 'react', 'react-dom', 'redux', 'react-redux' ],
  },
  externals: {
    d3: 'd3',
  },
  optimization: {
    minimize: true,
    runtimeChunk: false,
    splitChunks: {
      chunks: 'all',
    }
  },
  output: {
    path: DIST_PATH,
    filename: '[name].[chunkhash].js',
    chunkFilename: 'chunk.[chunkhash].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg|png|jpg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8000,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new htmlWebpackPlugin({
      template: INDEX_PATH,
    }),
  ],
  resolve: {
    modules: [
      'node_modules',
    ],
    extensions: ['.js', '.jsx'],
    alias: {
      '@actions': path.resolve(APP_PATH, 'state', 'actions'),
      '@apis': path.resolve(APP_PATH, 'apis'),
      '@app-assets': path.resolve(APP_PATH, 'app-assets'),
      '@components': path.resolve(APP_PATH, 'components'),
      '@config': path.resolve(APP_PATH, 'config'),
      '@constants': path.resolve(APP_PATH, 'constants'),
      '@containers': path.resolve(APP_PATH, 'containers'),
      '@hocs': path.resolve(APP_PATH, 'hocs'),
      '@models': path.resolve(APP_PATH, 'models'),
      '@modules': path.resolve(APP_PATH, 'modules'),
      '@selectors': path.resolve(APP_PATH, 'state', 'selectors'),
      '@src': path.resolve(APP_PATH),
      '@utils': path.resolve(APP_PATH, 'utils'),
    },
  },
  target: 'web',
};
