import express from "express";
import fs from 'fs';
import path from "path";
import { Provider as ReduxProvider } from 'react-redux';
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from 'react-router-dom';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import appConfig from '@config/appConfig';
import configureStore from '../client/state/configureStore';
import makeHtml from './makeHtml';
import RootContainer from '@containers/app/RootContainer/RootContainer.web';
import webpackConfig from '../../internals/webpack/webpack.config.client.local.web';

console.log(123, webpackConfig);

const webpackCompiler = webpack(webpackConfig);

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

app.use(htmlLogger);

app.use(webpackDevMiddleware(webpackCompiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    color: true,
  },
}));

app.use(webpackHotMiddleware(webpackCompiler, {
  heartbeat: 2000,
}));

app.get("/*", (req, res) => {
  console.log(1)
  res.send({
    power: 1,
  })
  // const store = configureStore();

  // if (state.status !== SERVER_STATUS.LAUNCH_SUCCESS) {
  //   res.writeHead(500);
  //   res.end('server is not launched');
  // } else {
  //   const element = (
  //     <ReduxProvider store={store}>
  //       <StaticRouter 
  //         context={{}}
  //         location={req.url}>
  //         <RootContainer/>
  //       </StaticRouter>
  //     </ReduxProvider>
  //   );
  //   const elementInString = renderToString(element);

  //   res.writeHead(200, { "Content-Type": "text/html" });
  //   res.end(makeHtml({
  //     reactDom: elementInString,
  //     reduxState: store,
  //     reduxStateKey: appConfig.reduxStateKey,
  //     bundles: state.entrypointBundles,
  //   }));
  // }
});

app.listen(PORT, () => {
  console.info('Server listening: %s', PORT);
});

function htmlLogger(req, res, next) {
  console.info('%s f- url: %s, user agent: %s', new Date(), req.url, req.get('User-Agent'));
  next();
}
