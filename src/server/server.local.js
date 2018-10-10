import express from "express";
import fs from 'fs';
import path from "path";
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { calculateNextStateWhileSearchingForBundles } from './serverUtils';
import createExpress from './createExpress';
import LaunchStatus from './constants/LaunchStatus';
import paths from './paths';

const webpackConfigClientLocalWeb = require(paths.webpackConfigClientLocalWeb)

export default createExpress({
  enhance: (app, state) => {
    console.info('server local - enhance, webpack configuration', webpackConfigClientLocalWeb);
    const clientWebpackCompiler = webpack(webpackConfigClientLocalWeb);

    const devMiddleware = webpackDevMiddleware(clientWebpackCompiler, {
      publicPath: webpackConfigClientLocalWeb.output.publicPath,
      serverSideRender: true,
      stats: {
        color: true,
      },
    });

    const hotMiddleware = webpackHotMiddleware(clientWebpackCompiler, {
      heartbeat: 2000,
      reload: true,
    });

    app.use(devMiddleware);

    app.use(hotMiddleware);

    app.use((req, res, next) => {
      (function updateEntrypointsIfServerIsLaunched() {
        if (state.launchStatus !== LaunchStatus.NOT_LAUNCHED) {
          const info = res.locals.webpackStats.toJson({
            all: false,
            assets: true,
            builtAt: true,
            entrypoints: true,
          });
          state.update(calculateNextStateWhileSearchingForBundles(info.entrypoints));
        }
        next();
      })();
    });
  },
});
