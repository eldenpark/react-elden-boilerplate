import express from "express";
import fs from 'fs';
import path from "path";
import { Provider as ReduxProvider } from 'react-redux';
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from 'react-router-dom';
import util from 'util';

import appConfig from '@config/appConfig';
import configureStore from '../client/state/configureStore';
import LaunchStatus from './constants/LaunchStatus';
import makeHtml from './makeHtml';
import RootContainer from '@containers/app/RootContainer/RootContainer.web';

export default function createServer({
  enhance = (app, state) => {},
}) {
  const app = express();
  let state = {
    entrypointBundles: [],
    launchStatus: LaunchStatus.NOT_LAUNCHED,
    update(obj = {}) {
      for (let key in this) {
        if (obj[key]) {
          this[key] = obj[key];
        }
      }
    },
  };

  app.use(htmlLogger);

  enhance(app, state);
  
  app.get("*", (req, res) => {
    console.log('fresh request, entrypointBundlers: %j', state.entrypointBundles)
    const store = configureStore();
  
    if (state.launchStatus !== LaunchStatus.LAUNCH_SUCCESS) {
      res.writeHead(500);
      res.end(util.format('server is not successfully launched, launch_status: %s', state.launchStatus));
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
  
  app.listen(appConfig.ports.prod, () => {
    console.info('Server listening: %s', appConfig.ports.prod);
  });

  return app;
};

function htmlLogger(req, res, next) {
  console.info('%s url: %s, user agent: %s', new Date(), req.url, req.get('User-Agent'));
  next();
}