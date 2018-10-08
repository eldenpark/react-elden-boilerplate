const del = require('del');
const fs = require('fs');
const express = require('express');
const http = require('http');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const calculateNextStateWhileSearchingForBundles = require('./serverUtils').calculateNextStateWhileSearchingForBundles;
const paths = require('./paths');
const webpackConfigClientLocalWeb = require(paths.webpackClientLocalWeb);
const webpackConfigServerLocal = require(paths.webpackServerLocal);

const devEnv = process.env.NODE_ENV === 'development';

devEnv ? launchLocalServer() : launchProdServer();

function launchLocalServer() {
  const serverWebpackCompiler = webpack(webpackConfigServerLocal);
  const watchOptions = {
    aggregateTimeout: 2000,
    poll: undefined,
  };

  del.sync([
    paths.distServer,
  ]);

  serverWebpackCompiler.watch(watchOptions, (err, stats) => {
    console.info('[webpack:server:local] webpack configuration:\n%o\n', webpackConfigServerLocal);
    if (err || stats.hasErrors()) {
      const errorMsg = stats.toString('errors-only');
      console.error(errorMsg);
    } else {
      const info = stats.toJson({
        all: false,
        assets: true,
        builtAt: true,
        entrypoints: true,
      });

      const entrypointBundles = calculateNextStateWhileSearchingForBundles(info.entrypoints).entrypointBundles;
      console.log(123, entrypointBundles[1]);

      console.info('[webpack:server:local] compilation success:\n%o\n', info);
      console.info('[webpack:server:local] compilation success lately at: %s', new Date());

      const server = require('../../dist/server/' + entrypointBundles[0]).default;
      runHttpServer(server.app);
    }
  });
}

function launchProdServer() {
  const server = require('../../dist/server/server.prod.js').default;
  runHttpServer(server.app);
}

function runHttpServer(app) {
  const httpServer = http.createServer(app);
  httpServer.listen(5001, () => {
    console.log('Listening on 5001');
  });
}
