const path = require('path');
const webpack = require('webpack');

const webpackConfigClientWeb  = require('./webpack.config.client.web');

const config = {
  mode: 'production',
};

module.exports = Object.assign({}, webpackConfigClientWeb, config);
