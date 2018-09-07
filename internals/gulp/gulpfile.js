const babel = require('gulp-babel');
const del = require('del');
const fs = require('fs');
const gulp = require('gulp');
const path = require('path');
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack');

const babelRc = require('../../.babelrc');

const DIST_PATH = path.resolve(__dirname, '../../dist');
const DIST_BUNDLE_PATH = path.resolve(__dirname, '../../dist/bundle');
const LOG_PATH = path.resolve(__dirname, '../../logs');
const SRC_PATH = path.resolve(__dirname, '../../src');

(function changeCurrentWorkingDirectoryToResolveNodeModulesPath() {
  process.chdir('../../');
  console.info('Current working directory %s', process.cwd());
})();

gulp.task('babel', () => {
  console.info('[babel], DIST_PATH: %s, SRC_PATH: %s', DIST_PATH, SRC_PATH);

  return gulp.src([`${SRC_PATH}/**/*.{js,jsx}`])
    .pipe(sourcemaps.init())
    .pipe(babel(babelRc))
    .pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(DIST_PATH));
});

gulp.task('clean:client', () => {
  console.info('[clean] Remove all the contents in %s', DIST_PATH);

  return del([
    `${DIST_PATH}/bundle/**/*`,
  ]);
});

gulp.task('clean:server', () => {
  console.info('[clean] Remove all the contents in %s', DIST_PATH);

  return del([
    `${DIST_PATH}/server/**/*`,
    `${DIST_PATH}/client/**/*`,
  ]);
});

// gulp.task('copy', () => {
//   console.info('[copy] src: %s, tgt: %s', SERVER_SRC_PATH, BUILD_PATH);

//   return gulp.src([
//     `${SERVER_SRC_PATH}/**/*`,
//     `!${SERVER_SRC_PATH}/**/*.js`,
//   ])
//     .pipe(gulp.dest(BUILD_PATH));
// });

gulp.task('emptylog', () => {
  console.info('[emptylog] LOG_PATH: %s', LOG_PATH);

  return del([
    `${LOG_PATH}/**/*`,
  ]);
});

gulp.task('webpack:client', (done) => {
  const entrypointBundles = [];
  const webpackConfig = require('../webpack/webpack.config.dev.web');
  const compiler = webpack(webpackConfig);

  compiler.run((err, stats) => {
    console.info('[webpack:client] webpack configuration:\n%o\n', webpackConfig);
    if (err || stats.hasErrors()) {
      console.error(stats.toString('erros-only'));
    } else {
      const info = stats.toJson({
        all: false,
        assets: true,
        builtAt: true,
        entrypoints: true,
      });
      console.info('[webpack:client] compilation success:\n%o\n', info);
      fs.writeFileSync(`${DIST_BUNDLE_PATH}/build.json`, JSON.stringify(info));
    }
    done();
  });
});

gulp.task('build:client', gulp.series('clean:client', 'webpack:client'));
gulp.task('build:server', gulp.series('clean:server', 'babel'));
