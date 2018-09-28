const serverProdConfig = {
  devtool: 'source-map',
  entry: {
    server: [
      path.resolve(SERVER_PATH, 'server.local.js'),
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
    path: DIST_SERVER_PATH,
    filename: '[name].[hash].js',
    publicPath: '/',
  },
  stats: {
    colors: true,
  },
  target: 'node',
};
