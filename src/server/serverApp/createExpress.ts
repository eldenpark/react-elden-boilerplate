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
  let state: State = {
    entrypointBundles: [],
    launchStatus: LaunchStatus.NOT_LAUNCHED,
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
  
  app.get("*", async (req, res) => {
    expressLog.debug('"*" route, entrypointBundlers: %j', state);

    if (state.launchStatus !== LaunchStatus.LAUNCH_SUCCESS) {
      res.writeHead(500);
      res.end(util.format('Server is not successfully launched, launch_status: %s', state.launchStatus));
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });

      try {
        const html = await makeHtml({
          entrypointBundles: state.entrypointBundles,
          requestUrl: req.url,
          rootContainerPath: state.rootContainerPath,
          storeKey: appConfig.reduxStateKey,
        });
        res.end(html);
      } catch (err) {
        expressLog.error(err);
        res.end('Failed to create html');
      }
    }
  });
  
  return {
    app,
    state,
  };
};

interface State {
  entrypointBundles: string[],
  launchStatus: string,
  rootContainerPath: string,
  update: (arg: object) => void,
}

function htmlLogger(req, res, next) {
  httpLog.debug('%s url: %s, user agent: %s', new Date(), req.url, req.get('User-Agent'));
  next();
}
