const babel = require('gulp-babel');
const del = require('del');
const gulp = require('gulp');
const path = require('path');
const sourcemaps = require('gulp-sourcemaps');

const BUILD_PATH = path.resolve(__dirname, '../../build');
const DIST_PATH = path.resolve(__dirname, '../../dist');
const LOG_PATH = path.resolve(__dirname, '../../logs');
const ROOT_PATH = path.resolve(__dirname, '../../');
const SERVER_SRC_PATH = path.resolve(__dirname, '../../src/server');

const babelRc = {
  "env": {
    "local": {
      "plugins": [
        "react-hot-loader/babel",
        [ 
          "babel-plugin-styled-components", 
          { "displayName": true }
        ]
      ]
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
console.log('Current working directory %s', process.cwd());

gulp.task('babel', () => {
  console.log('[babel], BUILD_PATH: %s, SERVER_SRC_PATH: %s', BUILD_PATH, SERVER_SRC_PATH);

  return gulp.src([`${SERVER_SRC_PATH}/**/*.js`])
    .pipe(sourcemaps.init())
    .pipe(babel(babelRc))
    .pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(BUILD_PATH));
});

gulp.task('clean', () => {
  console.log('[clean] Remove all the contents in %s', BUILD_PATH);

  return del([
    `${BUILD_PATH}/**/*`,
  ]);
});

gulp.task('copy', () => {
  console.log('[copy] src: %s, tgt: %s', SERVER_SRC_PATH, BUILD_PATH);

  return gulp.src([
    `${SERVER_SRC_PATH}/**/*`,
    `!${SERVER_SRC_PATH}/**/*.js`,
  ])
    .pipe(gulp.dest(BUILD_PATH));
});

gulp.task('emptylog', () => {
  console.log('[emptylog] LOG_PATH: %s', LOG_PATH);

  return del([
    `${LOG_PATH}/**/*`,
  ]);
});

gulp.task('build', gulp.series('clean', 'copy', 'babel'));
