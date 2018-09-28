const path = require('path');

module.exports = {
  distBundle: path.resolve(__dirname, '../../dist/bundle'),
  distServer: path.resolve(__dirname, '../../dist/server'),
  srcClient: path.resolve(__dirname, '../../src/client'),
  srcServer: path.resolve(__dirname, '../../src/server'),
};
