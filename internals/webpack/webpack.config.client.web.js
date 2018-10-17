const path = require('path');

const babelRc = require('../babel/.babelrc');
const paths = require('../../src/server/paths');

module.exports = {
  context: __dirname,
  entry: {
    app: path.resolve(paths.srcClient, 'client.tsx'),
    react: [ 'react', 'react-dom', 'redux', 'react-redux' ],
  },
  externals: {},
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.[jt]sx?$/,
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
  mode: 'production',
  optimization: {
    minimize: true,
    runtimeChunk: false,
    splitChunks: {
      chunks: 'all',
    }
  },
  output: {
    path: paths.distPublicBundle,
    filename: '[name].[chunkhash].js',
    chunkFilename: 'chunk.[chunkhash].js',
    publicPath: '/',
  },
  plugins: [
  ],
  resolve: {
    modules: [
      'node_modules',
    ],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  target: 'web',
};
