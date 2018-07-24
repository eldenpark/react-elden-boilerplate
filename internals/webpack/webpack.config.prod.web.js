const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

const config  = require('./webpack.config.web');
const APP_PATH = path.resolve(__dirname, '../../src/app');

const prodConfig = {
  mode: 'production',
};

module.exports = merge(config, prodConfig);
