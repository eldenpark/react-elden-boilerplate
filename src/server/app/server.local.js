const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const createServer = require('./createServer');

const webpackConfig = require('../../../internals/webpack/webpack.config.dev.web');
const webpackCompiler = webpack(webpackConfig);

module.exports = () => createServer({
  extend,  
});

function extend(app) {
  app.use(webpackDevMiddleware(webpackCompiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      color: true,
    },
  }));
  
  app.use(webpackHotMiddleware(webpackCompiler, {
    heartbeat: 2000,
  }));

  app.use('*', (req, res, next) => {
    const filename = path.resolve(webpackCompiler.outputPath, 'index.html');
    webpackCompiler.outputFileSystem.readFile(filename, function (err, result) {
      if (err) {
        console.log('Most likely the compilation did not succeed');
        throw new Error(err);
      }
      res.set('content-type','text/html');
      res.send(result);
      res.end();
    });
  });
}
