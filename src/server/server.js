const del = require('del');
const fs = require('fs');
const express = require('express');
const http = require('http');
const path = require('path');
const webpack = require('webpack');

const LaunchStatus = require('@server/constants/LaunchStatus');
const { launchLog, webpackLog } = require('@server/modules/Log');
const paths = require('@server/paths');
const webpackConfigServerLocal = require(paths.webpackConfigServerLocal);
const serverUtils = require('@server/utils/serverUtils');

const prodEnv = process.env.NODE_ENV === 'production' || false;
let httpServer = undefined;

launchLog.info('NODE_ENV: %s', process.env.NODE_ENV);

(function setBabelPolyfill() {
  if ((typeof window !== 'undefined' && !window['_babelPolyfill']) 
    || (typeof global !== 'undefined' && !global['_babelPolyfill'])) {
    console.info(`babel-polyfill is imported, since it wasn't imported yet`);
    require('babel-polyfill');
  }
})();

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

  const server = require('@server/serverApp/server.local').default;
  const state = server.state;
  state.update({
    localServer: true,
  });
  runHttpServer(server.app);

  (function replaceRootContainerBundleWhenFilesAreChanged() {
    serverWebpackCompiler.watch(watchOptions, (err, stats) => {
      if (err || stats.hasErrors()) {
        const errorJson = stats.toJson('errors-only');
        webpackLog.error('error: %j\n%o', errorJson);
      } else {
        const info = stats.toJson({
          all: false,
          assets: true,
          builtAt: true,
          entrypoints: true,
        }); 
        webpackLog.info('webpack watch() success: at: %s, \n%o', new Date(), info);
        fs.writeFileSync(`${paths.distServer}/build.json`, JSON.stringify(info, null, 2));
        
        delete require.cache[state.rootContainerPath];
        webpackLog.info('require cache: ', serverUtils.getProperRequireCache());
        
        const rootContainerBundlePath = path.resolve(paths.distServer, info.entrypoints.rootContainer.assets[0]);
        state.update({
          launchStatus: LaunchStatus.LAUNCH_SUCCESS,
          rootContainerPath: rootContainerBundlePath,
        });
      }
    });
  })();
}

function launchProdServer() {
  const server = require('@server/serverApp/server.prod').default;
  runHttpServer(server.app);
}

function runHttpServer(app) {
  if (httpServer !== undefined) {
    launchLog.info('[httpServer] http server is already running');
  } else {
    httpServer = http.createServer(app);
    httpServer.listen(5001, () => {
      launchLog.info('Listening on 5001');
    });
  }
}
