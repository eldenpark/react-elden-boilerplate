const path = require('path');

const ROOT_PATH = path.resolve(__dirname, '../../../');

module.exports = {
  distPath: path.resolve(ROOT_PATH, 'dist'),
  gitFetchHeadPath: path.resolve(ROOT_PATH, '.git/FETCH_HEAD'),
  indexPath: path.resolve(ROOT_PATH, 'dist/index.html'),
  serverAssetPath: path.resolve(__dirname, '../assets'),
};
