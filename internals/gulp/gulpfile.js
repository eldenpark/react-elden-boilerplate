const babel = require('gulp-babel');
const del = require('del');
const gulp = require('gulp');
const path = require('path');
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack');

const webpackConfig = require('../webpack/webpack.config.web');

const BUILD_PATH = path.resolve(__dirname, '../../build');
const DIST_PATH = path.resolve(__dirname, '../../dist');
const LOG_PATH = path.resolve(__dirname, '../../logs');
const ROOT_PATH = path.resolve(__dirname, '../..');
const SRC_PATH = path.resolve(__dirname, '../../src');

const babelRc = {
  "env": {
    "local": {
    }
  },
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react",
    [ "@babel/preset-stage-2", { "decoratorsLegacy": true } ]
  ]
};

/**
 * Ensure that the current working directory is project root. This allows taking
 * `node_modules` path as expected.
 */
process.chdir('../../');
console.info('Current working directory %s', process.cwd());

gulp.task('babel', () => {
  console.info('[babel], DIST_PATH: %s, SRC_PATH: %s', DIST_PATH, SRC_PATH);

  return gulp.src([`${SRC_PATH}/**/*.{js,jsx}`])
    .pipe(sourcemaps.init())
    .pipe(babel(babelRc))
    .pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(DIST_PATH));
});

gulp.task('clean', () => {
  console.info('[clean] Remove all the contents in %s', DIST_PATH);

  return del([
    `${DIST_PATH}/**/*`,
  ]);
});

gulp.task('copy', () => {
  console.info('[copy] src: %s, tgt: %s', SERVER_SRC_PATH, BUILD_PATH);

  return gulp.src([
    `${SERVER_SRC_PATH}/**/*`,
    `!${SERVER_SRC_PATH}/**/*.js`,
  ])
    .pipe(gulp.dest(BUILD_PATH));
});

gulp.task('emptylog', () => {
  console.info('[emptylog] LOG_PATH: %s', LOG_PATH);

  return del([
    `${LOG_PATH}/**/*`,
  ]);
});

gulp.task('webpack:client', (done) => {
  const compiler = webpack(webpackConfig);
  compiler.run((err, stats) => {
    if (err || stats.hasErrors()) {
      console.error(stats.toJson('erros-only').errors);
      done();
    } else {
      const info = stats.toString({
        colors: true,
      });
      console.info(info);
      done();
    }
  });
});

gulp.task('build', gulp.series('clean', 'babel', 'webpack:client'));

// "build:app": "NODE_ENV=production node ./internals/webpack/build.js",
