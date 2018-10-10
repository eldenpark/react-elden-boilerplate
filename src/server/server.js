const del = require('del');
const fs = require('fs');
const express = require('express');
const http = require('http');
const path = require('path');
const webpack = require('webpack');

const LaunchStatus = require('./constants/LaunchStatus');
const paths = require('./paths');
const webpackConfigServerLocal = require(paths.webpackConfigServerLocal);

const prodEnv = process.env.NODE_ENV === 'production' || false;
let httpServer = undefined;

console.info('NODE_ENV: %s', process.env.NODE_ENV);

prodEnv ? launchProdServer() : launchLocalServer();

function launchLocalServer() {
  del.sync([
    paths.distServer,
  ]);

  const serverWebpackCompiler = webpack(webpackConfigServerLocal);
  const watchOptions = {
    aggregateTimeout: 2000,
    poll: undefined,
  };

  const server = require('./server.local').default;
  const state = server.state;
  state.update({
    localServer: true,
  });
  runHttpServer(server.app);

  serverWebpackCompiler.watch(watchOptions, (err, stats) => {
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
      console.info('[webpack:server:local] webpack watch() success: at: %s, \n%o\n', new Date(), info);
      
      delete require.cache[state.rootContainerPath];
      printRequireCache();
      
      const rootContainerBundlePath = path.resolve(paths.distServer, info.entrypoints.rootContainer.assets[0]);
      state.update({
        launchStatus: LaunchStatus.LAUNCH_SUCCESS,
        rootContainerPath: rootContainerBundlePath,
      });
    }
  });
}

function launchProdServer() {
  const server = require('./server.prod').default;
  runHttpServer(server.app);
}

function runHttpServer(app) {
  if (httpServer !== undefined) {
    console.info('[httpServer] http server is already running');
  } else {
    httpServer = http.createServer(app);
    httpServer.listen(5001, () => {
      console.log('Listening on 5001');
    });
  }
}

function printRequireCache() {
  return Object.keys(require.cache)
    .filter((key) => {
      return !key.startsWith('/Users/mistock1706/work/Eldeni/react-boilerplate/node_modules/');
    });
}
