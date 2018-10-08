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
  distBundle: path.resolve(DIST_PATH, 'bundle'),
  distServer: path.resolve(DIST_PATH, 'server'),
  srcClient: path.resolve(SRC_PATH, 'client'),
  srcServer: path.resolve(SRC_PATH, 'server'),
  webpackClientLocalWeb: path.resolve(WEBPACK_PATH, 'webpack.config.client.local.web'),
  webpackClientProdWeb: path.resolve(WEBPACK_PATH, 'webpack.config.client.prod.web'),
  webpackServerLocal: path.resolve(WEBPACK_PATH, 'webpack.config.server.local'),
  webpackServerProd: path.resolve(WEBPACK_PATH, 'webpack.config.server.prod'),
};
