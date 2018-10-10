import express from "express";
import util from 'util';

// import appConfig from '@config/appConfig';
import configureStore from '../client/state/configureStore';
import LaunchStatus from './constants/LaunchStatus';
import makeHtml from './makeHtml';

export default function createServer({
  enhance = (app, state) => {},
}) {
  const app = express();
  let state = {
    entrypointBundles: [],
    launchStatus: LaunchStatus.NOT_LAUNCHED,
    localServer: false,
    rootContainerPath: undefined,
    update(obj = {}) {
      console.info('[state], state will update with: %o', obj);
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
    console.log('fresh request, entrypointBundlers: %j', state)
    const store = configureStore();
  
    if (state.launchStatus !== LaunchStatus.LAUNCH_SUCCESS) {
      res.writeHead(500);
      res.end(util.format('server is not successfully launched, launch_status: %s', state.launchStatus));
    } else if (state.localServer && state.rootContainerPath === undefined) {
      res.end("not yet loaded");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(makeHtml({
        entrypointBundles: state.entrypointBundles,
        localServer: state.localServer,
        requestUrl: req.url,
        rootContainerPath: state.rootContainerPath,
        store,
        // storeKey: appConfig.reduxStateKey,
      }));
    }
  });
  
  return {
    app,
    state,
  };
};

function htmlLogger(req, res, next) {
  console.info('%s url: %s, user agent: %s', new Date(), req.url, req.get('User-Agent'));
  next();
}
