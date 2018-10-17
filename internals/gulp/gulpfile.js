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
const tslint = require("gulp-tslint");
const typescript = require('gulp-typescript');
const util = require('util');
const webpack = require('webpack');

const babelRc = require('../babel/.babelrc');
const paths = require('../../src/server/paths');
const tslintConfig = require('../tslint/tslint');

const buildLog = (tag, ...args) => {
  console.info(chalk.cyan(`[build - ${tag}]`), util.format(...args));
}

const Task = {
  BABEL: 'babel',
  CLEAN_BUNDLE: 'clean:bundle',
  CLEAN_DIST_EXCEPT_BUNDLE: 'clean:dist:except:bundle',
  COPY_PUBLIC: 'copy:public',
  EMPTYLOG: 'emptylog',
  TSC: 'tsc',
  TSLINT: 'tslint',
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

gulp.task(Task.CLEAN_BUNDLE, () => {
  return del([
    `${paths.distPublicBundle}/**/*`,
  ]);
});

gulp.task(Task.CLEAN_DIST_EXCEPT_BUNDLE, () => {
  buildLog(
    Task.CLEAN_DIST_EXCEPT_BUNDLE, 
    'Remove all the contents in %s, except in %s', 
    paths.dist,
    paths.distPublicBundle);

  return del([
    `${paths.dist}/**/*`,
    `!${paths.dist}/public`,
    `!${paths.dist}/public/bundle/**`,
  ]);
});

gulp.task(Task.COPY_PUBLIC, () => {
  buildLog(Task.COPY_PUBLIC, 'Copy contents from %s to %s', paths.srcServerPublic, paths.distPublic);

  return gulp.src([`${paths.srcServerPublic}/**/*`])
    .pipe(gulp.dest(paths.distPublic));
});

gulp.task(Task.EMPTYLOG, () => {
  buildLog.info(Task.EMPTYLOG, 'LOG_PATH: %s', paths.logs);

  return del([
    `${paths.logs}/**/*`,
  ]);
});

gulp.task(Task.TSC, () => {
  const tsProject = typescript.createProject('tsconfig.json');
  buildLog(Task.TSC, 'Typescript configuration:\n%o', tsProject.config);

  return gulp.src([`${paths.src}/**/*.{js,jsx,ts,tsx}`])
    .pipe(tsProject());
});

gulp.task(Task.TSLINT, (done) => {
  buildLog(Task.TSLINT, 'TSLint with configuration:\n%o', tslintConfig);

  return gulp.src(`${paths.src}/**/*.{ts,tsx}`)
    .pipe(tslint({
      configuration: 'internals/tslint/tslint.js',
      formatter: 'stylish',
    }))
    .pipe(tslint.report())
    .on('error', function ignoreError(err) {});
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
      fs.writeFileSync(`${paths.distPublicBundle}/build.json`, JSON.stringify(info, null, 2));
      done();
    }
  });
});

gulp.task('build:client:prod', gulp.series(Task.CLEAN_BUNDLE, Task.WEBPACK_CLIENT_PROD));

gulp.task('build:server', gulp.series(Task.CLEAN_DIST_EXCEPT_BUNDLE, Task.TSC, Task.COPY_PUBLIC, Task.BABEL));

gulp.task('build:prod', gulp.parallel('build:server', 'build:client:prod'));
