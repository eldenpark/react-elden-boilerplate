import express from "express";
import fs from 'fs';
import path from "path";
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { calculateNextStateWhileSearchingForBundles } from './serverUtils';
import createServer from './createServer';
import LaunchStatus from './constants/LaunchStatus';
import webpackConfigClientLocalWeb from '../../internals/webpack/webpack.config.client.local.web';

export default createServer({
  enhance: (app, state) => {
    console.info('server local - webpack configuration', webpackConfigClientLocalWeb);
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
      if (state.LaunchStatus !== LaunchStatus.NOT_LAUNCHED) {
        const info = res.locals.webpackStats.toJson({
          all: false,
          assets: true,
          builtAt: true,
          entrypoints: true,
        });
        state.update(calculateNextStateWhileSearchingForBundles(info.entrypoints));
      }
      next();
    });
  },
});
