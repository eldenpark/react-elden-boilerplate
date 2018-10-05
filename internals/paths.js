const fs = require('fs');
const path = require('path');

const ROOT_PATH = fs.realpathSync(process.cwd());
const DIST_PATH = path.resolve(ROOT_PATH, 'dist');
const SRC_PATH = path.resolve(ROOT_PATH, 'src');
const WEBPACK_PATH = path.resolve(ROOT_PATH, 'internals/webpack');

console.log('ROOT_PATH: %s', ROOT_PATH);
if (ROOT_PATH.substr(-4) === 'gulp') {
  console.warn(`Current working directory might not be the project root directory.
Did you call process.chdir() properly?`);
}

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
