const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

const config  = require('./webpack.config.client.web');

const prodConfig = {
  mode: 'development', // temp
};

module.exports = merge(config, prodConfig);
