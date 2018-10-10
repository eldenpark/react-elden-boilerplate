(function changeCurrentWorkingDirectoryToResolveNodeModulesPath() {
  process.chdir('../../');
  console.info('Current working directory %s', process.cwd());
})();

const babel = require('gulp-babel');
const del = require('del');
const fs = require('fs');
const gulp = require('gulp');
const path = require('path');
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack');

const babelRc = require('../babel/.babelrc');
const paths = require('../../src/server/paths');

const Task = {
  WEBPACK_CLIENT_PROD: 'webpack:client:prod',
};

gulp.task('babel', () => {
  console.info(
    '[babel], NODE_ENV: %s, DIST_PATH: %s, SRC_PATH: %s', 
    process.env.NODE_ENV, 
    paths.distBabel, 
    paths.src,
  );

  return gulp.src([`${paths.src}/**/*.{js,jsx}`])
    .pipe(sourcemaps.init())
    .pipe(babel(babelRc))
    .pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(paths.distBabel));
});

gulp.task('clean:babel', () => {
  console.info('[clean] Remove all the contents in %s', paths.distBabel);

  return del([
    `${paths.distBabel}/**/*`,
  ]);
});

gulp.task('clean:bundle', () => {
  console.info('[clean] Remove all the contents in %s', paths.distBundle);

  return del([
    `${paths.distBundle}/**/*`,
  ]);
});

gulp.task('emptylog', () => {
  console.info('[emptylog] LOG_PATH: %s', paths.logs);

  return del([
    `${paths.logs}/**/*`,
  ]);
});

gulp.task(Task.WEBPACK_CLIENT_PROD, (done) => {
  let webpackConfig = undefined;
  try {
    webpackConfig = require(paths.webpackConfigClientProdWeb);
  } catch (err) {
    console.error(`${Task.WEBPACK_CLIENT_PROD} webpack config is not found`);
    done(new Error(err));
  }
  const compiler = webpack(webpackConfig);

  compiler.run((err, stats) => {
    console.info(`${Task.WEBPACK_CLIENT_PROD} webpack configuration:\n%o\n`, webpackConfig);
    if (err || stats.hasErrors()) {
      const errorMsg = stats.toString('errors-only');
      console.error(errorMsg);
      done(new Error(errorMsg));
    } else {
      const info = stats.toJson({
        all: false,
        assets: true,
        builtAt: true,
        entrypoints: true,
      });
      console.info('[webpack:client:prod] compilation success:\n%o\n', info);
      fs.writeFileSync(`${paths.distBundle}/build.json`, JSON.stringify(info));
      done();
    }
  });
});

gulp.task('build:client:prod', gulp.series('clean:bundle', 'webpack:client:prod'));
gulp.task('build:server', gulp.series('clean:babel', 'babel'));
