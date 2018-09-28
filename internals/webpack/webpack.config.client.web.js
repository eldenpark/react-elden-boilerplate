const htmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const babelRc = require('../babel/.babelrc');
const paths = require('./paths');

module.exports = {
  context: __dirname,
  entry: {
    app: path.resolve(paths.srcClient, 'client.jsx'),
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
    path: paths.distBundle,
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
      '@actions': path.resolve(paths.srcClient, 'state', 'actions'),
      '@apis': path.resolve(paths.srcClient, 'apis'),
      '@app-assets': path.resolve(paths.srcClient, 'app-assets'),
      '@components': path.resolve(paths.srcClient, 'components'),
      '@config': path.resolve(paths.srcClient, 'config'),
      '@constants': path.resolve(paths.srcClient, 'constants'),
      '@containers': path.resolve(paths.srcClient, 'containers'),
      '@hocs': path.resolve(paths.srcClient, 'hocs'),
      '@models': path.resolve(paths.srcClient, 'models'),
      '@modules': path.resolve(paths.srcClient, 'modules'),
      '@selectors': path.resolve(paths.srcClient, 'state', 'selectors'),
      '@client': path.resolve(paths.srcClient),
      '@utils': path.resolve(paths.srcClient, 'utils'),
    },
  },
  target: 'web',
};
