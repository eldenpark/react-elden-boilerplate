import express from "express";
import * as util from 'util';

import appConfig from '@config/appConfig';
import * as LaunchStatus from '@server/constants/LaunchStatus';
import Log, { httpLog, expressLog, stateLog } from '@server/modules/Log';
import makeHtml from '@server/serverApp/makeHtml';
import * as paths from '@server/paths';

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
      stateLog.info('state will update with: %o', obj);
      for (let key in this) {
        if (obj[key]) {
          this[key] = obj[key];
        }
      }
    },
  };

  app.use(htmlLogger);

  enhance(app, state);

  app.use(express.static(paths.distPublic));
  
  app.get("*", (req, res) => {
    expressLog.debug('"*" route, entrypointBundlers: %j', state);

    if (state.launchStatus !== LaunchStatus.LAUNCH_SUCCESS) {
      res.writeHead(500);
      res.end(util.format('server is not successfully launched, launch_status: %s', state.launchStatus));
    } else if (state.localServer && state.rootContainerPath === undefined) {
      res.end("not yet loaded");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      const html = makeHtml({
        entrypointBundles: state.entrypointBundles,
        localServer: state.localServer,
        requestUrl: req.url,
        rootContainerPath: state.rootContainerPath,
        storeKey: appConfig.reduxStateKey,
      });
      html.then((result) => {
        res.end(result);
      });
    }
  });
  
  return {
    app,
    state,
  };
};

function htmlLogger(req, res, next) {
  httpLog.debug('%s url: %s, user agent: %s', new Date(), req.url, req.get('User-Agent'));
  next();
}
