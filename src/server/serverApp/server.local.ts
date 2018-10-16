import express from "express";
import * as fs from 'fs';
import * as path from "path";
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { calculateNextStateWhileSearchingForBundles } from '@server/utils/serverUtils';
import createExpress from '@server/serverApp/createExpress';
import * as LaunchStatus from '@server/constants/LaunchStatus';
import * as paths from '@server/paths';
import { webpackLog } from '@server/modules/Log';

const webpackConfigClientLocalWeb = require(paths.webpackConfigClientLocalWeb)

export default createExpress({
  enhance: (app, state) => {
    webpackLog.info('enhance(), webpackConfigClientLocalWeb', webpackConfigClientLocalWeb);
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
