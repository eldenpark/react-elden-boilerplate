const del = require('del');
const path = require('path');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const webpack = require('webpack');

const webpackConfig = require('./webpack.config.prod.web');
const webpackCompiler = webpack(webpackConfig);

const DIST_PATH = path.resolve(__dirname, '../../dist');

del([`${DIST_PATH}/*`]).then((paths) => {
  console.info('Deleted files and folders (Could be empty)');
  console.info(paths.join('\n'));

  console.info('\nWebpack compilation starts');
  
  webpackCompiler.apply(new ProgressPlugin({
    profile: true,
  }));

  webpackCompiler.run((err, stats) => {
    const info = stats.toJson('errors-only');

    if (err || stats.hasErrors()) {
      console.error(info.errors);
    } else {
      console.debug(stats.toString({
        colors: true,
      }));
    }
  });
})
  .catch((err) => {
    console.error(`Error deleting files in ${DIST_PATH}`);
  });
