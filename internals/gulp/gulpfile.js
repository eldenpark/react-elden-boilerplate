(function changeCurrentWorkingDirectoryToResolveNodeModulesPath() {
  process.chdir('../../');
  console.info('Current working directory %s', process.cwd());
})();

const babel = require('gulp-babel');
const chalk = require('chalk');
const del = require('del');
const fs = require('fs');
const gulp = require('gulp');
const path = require('path');
const sourcemaps = require('gulp-sourcemaps');
const util = require('util');
const webpack = require('webpack');

const babelRc = require('../babel/.babelrc');
const paths = require('../../src/server/paths');

const buildLog = (tag, ...args) => {
  console.info(chalk.cyan(`[build - ${tag}]`), util.format(...args));
}

const Task = {
  BABEL: 'babel',
  CLEAN_BABEL: 'clean:babel',
  CLEAN_BUNDLE: 'clean:bundle',
  EMPTYLOG: 'emptylog',
  WEBPACK_CLIENT_PROD: 'webpack:client:prod',
};

gulp.task(Task.BABEL, () => {
  buildLog(
    Task.BABEL,
    'NODE_ENV: %s, DIST_PATH: %s, SRC_PATH: %s',
    process.env.NODE_ENV, 
    paths.distBabel, 
    paths.src,
  );

  return gulp.src([`${paths.src}/**/*.{js,jsx,ts,tsx}`])
    .pipe(sourcemaps.init())
    .pipe(babel(babelRc))
    .pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(paths.distBabel));
});

gulp.task(Task.CLEAN_BABEL, () => {
  buildLog(Task.CLEAN_BABEL,'Remove all the contents in %s', paths.distBabel);

  return del([
    `${paths.distBabel}/**/*`,
  ]);
});

gulp.task(Task.CLEAN_BUNDLE, () => {
  buildLog(Task.CLEAN_BUNDLE, 'Remove all the contents in %s', paths.distBundle);

  return del([
    `${paths.distBundle}/**/*`,
  ]);
});

gulp.task(Task.EMPTYLOG, () => {
  buildLog.info(Task.EMPTYLOG, 'LOG_PATH: %s', paths.logs);

  return del([
    `${paths.logs}/**/*`,
  ]);
});

gulp.task(Task.WEBPACK_CLIENT_PROD, (done) => {
  let webpackConfig = undefined;
  try {
    webpackConfig = require(paths.webpackConfigClientProdWeb);
  } catch (err) {
    buildLog(Task.WEBPACK_CLIENT_PROD, 'error, webpack config is not found');
    done(new Error(err));
  }
  const compiler = webpack(webpackConfig);

  compiler.run((err, stats) => {
    buildLog(
      Task.WEBPACK_CLIENT_PROD,
      'NODE_ENV: %s, webpack configuration: %o',
      process.env.NODE_ENV,
      webpackConfig,
    );

    if (err || stats.hasErrors()) {
      const errorMsg = stats.toString('errors-only');
      buildLog(Task.WEBPACK_CLIENT_PROD, 'error', errorMsg);
      done(new Error(errorMsg));
    } else {
      const info = stats.toJson({
        all: false,
        assets: true,
        builtAt: true,
        entrypoints: true,
      });
      buildLog(Task.WEBPACK_CLIENT_PROD, 'compilation success:\n%o\n', info);
      fs.writeFileSync(`${paths.distBundle}/build.json`, JSON.stringify(info, null, 2));
      done();
    }
  });
});

gulp.task('build:client:prod', gulp.series('clean:bundle', 'webpack:client:prod'));
gulp.task('build:server', gulp.series('clean:babel', 'babel'));
gulp.task('build:prod', gulp.parallel('build:client:prod', 'build:server'));
