import express from "express";
import fs from 'fs';
import path from "path";
import { Provider as ReduxProvider } from 'react-redux';
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from 'react-router-dom';

import appConfig from '@config/appConfig';
import configureStore from '../client/state/configureStore';
import makeHtml from './makeHtml';
import paths from '../../internals/webpack/paths';
import RootContainer from '@containers/app/RootContainer/RootContainer.web';

const PORT = 5001;

const LAUNCH_STATUS = {
  LAUNCH_ERROR: 'LAUNCH_ERROR',
  LAUNCH_SUCCESS: 'LAUNCH_SUCCESS',
  NOT_LAUNCHED: 'NOT_LAUNCHED',
};

const app = express();
let state = {
  clone(obj) {
    const newInstance = { 
      ...this,
      ...obj,
     };
    return newInstance;
  },
  entrypointBundles: [],
  launchStatus: LAUNCH_STATUS.NOT_LAUNCHED,
};

state = state.clone((function calculateNextStateWhileSearchingForBundles() {
  try {
    const _build = fs.readFileSync(`${paths.distBundle}/build.json`);
    const build = JSON.parse(_build.toString('utf8'));
    console.info('[webpack build retrieval]: %o', build);

    const entrypointBundles = [];
    Object.keys(build.entrypoints)
      .map((entrypoint) => {
        build.entrypoints[entrypoint].assets.map((asset) => {
          asset.endsWith('js') && entrypointBundles.push(asset);
        });
      });
      return {
        entrypointBundles,
        launchStatus: LAUNCH_STATUS.LAUNCH_SUCCESS,
      };
  } catch (err) {
    console.error(err);
    return {
      launchStatus: LAUNCH_STATUS.LAUNCH_ERROR,
    };
  }
})());

app.use(htmlLogger);

app.use(express.static(paths.distBundle));

app.get("*", (req, res) => {
  const store = configureStore();

  if (state.launchStatus !== LAUNCH_STATUS.LAUNCH_SUCCESS) {
    res.writeHead(500);
    res.end('server is not launched');
  } else {
    const element = (
      <ReduxProvider store={store}>
        <StaticRouter 
          context={{}}
          location={req.url}>
          <RootContainer/>
        </StaticRouter>
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
