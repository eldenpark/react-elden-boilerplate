import express from "express";
import fs from 'fs';
import path from "path";
import { Provider as ReduxProvider } from 'react-redux';
import React from "react";
import { renderToString } from "react-dom/server";
import webpack from 'webpack';

import appConfig from '@config/appConfig';
import configureStore from '../client/state/configureStore';
import Layout from "../client/Layout.web";
import makeHtml from './makeHtml';
import webpackConfig from '../../internals/webpack/webpack.config.dev.web';

const DIST_BUNDLE_PATH = path.resolve(__dirname, '../../dist/bundle');

const PORT = 5001;

const SERVER_STATUS = {
  LAUNCH_ERROR: 'LAUNCH_ERROR',
  LAUNCH_SUCCESS: 'LAUNCH_SUCCESS',
  NOT_LAUNCHED: 'NOT_LAUNCHED',
};

const app = express();
const state = {
  entrypointBundles: [],
  status: SERVER_STATUS.NOT_LAUNCHED,
};

const compiler = webpack(webpackConfig);
compiler.run((err, stats) => {
  console.info('webpack configuration: %o', webpackConfig);
  if (err || stats.hasErrors()) {
    console.error(stats.toString('erros-only'));
  } else {
    const info = stats.toJson({
      all: false,
      assets: true,
      entrypoints: true,
    });
    Object.keys(info.entrypoints)
      .map((entrypoint) => {
        info.entrypoints[entrypoint].assets.map((asset) => {
          asset.endsWith('js') && state.entrypointBundles.push(asset);
        });
      });
    console.info('webpack compilation: %o', info);
    state.status = SERVER_STATUS.LAUNCH_SUCCESS;
  }
});

app.use(htmlLogger);
app.use(express.static(DIST_BUNDLE_PATH));

app.get("/*", (req, res) => {
  const store = configureStore();

  if (state.status !== SERVER_STATUS.LAUNCH_SUCCESS) {
    res.writeHead(404);
    res.end('server is not launched');
  } else {
    const element = (
      <ReduxProvider store={store}>
        <Layout/>
      </ReduxProvider>
    );
    const elementInString = renderToString(element);

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(makeHtml({
      reactDom: elementInString,
      reduxState: store,
      reduxStateKey: appConfig.reduxStateKey,
      bundles: state.entrypointBundles,
    }));
  }
});

app.listen(PORT, () => {
  console.info('Server listening: %s', PORT);
});

function htmlLogger(req, res, next) {
  console.info('%s f- url: %s, user agent: %s', new Date(), req.url, req.get('User-Agent'));
  next();
}
