import express from "express";
import fs from 'fs';
import path from "path";
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { calculateNextStateWhileSearchingForBundles } from './serverUtils';
import createServer from './createServer';
import LaunchStatus from './constants/LaunchStatus';
import webpackConfig from '../../internals/webpack/webpack.config.client.local.web';

export default createServer({
  enhance: (app, state) => {
    console.info('server local - webpack configuration', webpackConfig);
    const webpackCompiler = webpack(webpackConfig);

    app.use(webpackDevMiddleware(webpackCompiler, {
      publicPath: webpackConfig.output.publicPath,
      serverSideRender: true,
      stats: {
        color: true,
      },
    }));

    app.use(webpackHotMiddleware(webpackCompiler, {
      heartbeat: 2000,
    }));

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
