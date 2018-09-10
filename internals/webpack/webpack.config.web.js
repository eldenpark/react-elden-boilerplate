const htmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path');

const babelRc = require('../babel/.babelrc');

const CLIENT_PATH = path.resolve(__dirname, '../../src/client');
const DIST_BUNDLE_PATH = path.resolve(__dirname, '../../dist/bundle');
const INDEX_PATH = path.resolve(__dirname, './static/index.html');

module.exports = {
  context: __dirname,
  entry: {
    app: path.resolve(CLIENT_PATH, 'client.jsx'),
    react: [ 'react', 'react-dom', 'redux', 'react-redux' ],
  },
  externals: {},
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: babelRc,
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
  optimization: {
    minimize: true,
    runtimeChunk: false,
    splitChunks: {
      chunks: 'all',
    }
  },
  output: {
    path: DIST_BUNDLE_PATH,
    filename: '[name].[chunkhash].js',
    chunkFilename: 'chunk.[chunkhash].js',
    publicPath: '/',
  },
  plugins: [
    // new htmlWebpackPlugin({
    //   filename: 'raw_index.html',
    //   template: INDEX_PATH,
    // }),
  ],
  resolve: {
    modules: [
      'node_modules',
    ],
    extensions: ['.js', '.jsx'],
    alias: {
      '@actions': path.resolve(CLIENT_PATH, 'state', 'actions'),
      '@apis': path.resolve(CLIENT_PATH, 'apis'),
      '@app-assets': path.resolve(CLIENT_PATH, 'app-assets'),
      '@components': path.resolve(CLIENT_PATH, 'components'),
      '@config': path.resolve(CLIENT_PATH, 'config'),
      '@constants': path.resolve(CLIENT_PATH, 'constants'),
      '@containers': path.resolve(CLIENT_PATH, 'containers'),
      '@hocs': path.resolve(CLIENT_PATH, 'hocs'),
      '@models': path.resolve(CLIENT_PATH, 'models'),
      '@modules': path.resolve(CLIENT_PATH, 'modules'),
      '@selectors': path.resolve(CLIENT_PATH, 'state', 'selectors'),
      '@client': path.resolve(CLIENT_PATH),
      '@utils': path.resolve(CLIENT_PATH, 'utils'),
    },
  },
  target: 'web',
};
