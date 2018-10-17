const fs = require('fs');
const path = require('path');

const ROOT_PATH = fs.realpathSync(process.cwd());
const DIST_PATH = path.resolve(ROOT_PATH, 'dist');
const SRC_PATH = path.resolve(ROOT_PATH, 'src');
const WEBPACK_PATH = path.resolve(ROOT_PATH, 'internals/webpack');

(function checkIfCurrentWorkingDirectoryIsCorrect() {
  console.info('ROOT_PATH', ROOT_PATH);
  const pJson = fs.existsSync(`${ROOT_PATH}/package.json`);
  if (!pJson) {
    console.error(`Current working directory might not be the project root directory.
Did you call process.chdir() properly?`);
    process.exit(0);
  }
})();

module.exports = {
  dist: DIST_PATH,
  distBabel: path.resolve(DIST_PATH, 'babel'),
  distPublic: path.resolve(DIST_PATH, 'public'),
  distPublicBundle: path.resolve(DIST_PATH, 'public/bundle'),
  distServer: path.resolve(DIST_PATH, 'server'),
  logs: path.resolve(ROOT_PATH, 'logs'),
  src: SRC_PATH,
  srcClient: path.resolve(SRC_PATH, 'client'),
  srcServer: path.resolve(SRC_PATH, 'server'),
  srcServerPublic: path.resolve(SRC_PATH, 'server/public'),
  srcUniversal: path.resolve(SRC_PATH, 'universal'),
  webpackConfigClientLocalWeb: path.resolve(WEBPACK_PATH, 'webpack.config.client.local.web.js'),
  webpackConfigClientProdWeb: path.resolve(WEBPACK_PATH, 'webpack.config.client.prod.web'),
  webpackConfigServerLocal: path.resolve(WEBPACK_PATH, 'webpack.config.server.local'),
};
