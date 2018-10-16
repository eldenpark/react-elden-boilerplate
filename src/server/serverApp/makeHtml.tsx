import * as React from "react";
import { Provider as ReduxProvider } from 'react-redux';
import { renderToString } from "react-dom/server";
import { StaticRouter } from 'react-router-dom';
import { Store } from 'redux';

import ActionType from "@constants/ActionType";
import configureStore from '@client/state/configureStore';
import Log, { expressLog } from '@server/modules/Log';
import routes from '@client/routes';
import ServerApp from './ServerApp.web';

const makeHtml: MakeHtml = async function ({
  entrypointBundles,
  localServer = false,
  requestUrl = '',
  rootContainerPath = '',
  storeKey = 'REDUX_STATE_KEY__NOT_DEFINED',
}) {
  const store = await createStoreAndPrefetchData({
    requestUrl,
  });
  const state = store.getState();
  expressLog.debug('makeHtml() with store: %j', state);

  const appRoot = (
    <ServerApp
      localServer={localServer}
      requestUrl={requestUrl}
      rootContainerPath={rootContainerPath}
      store={store}
    />
  );
  const appRootInString = renderToString(appRoot);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>react-elden-boilerplate</title>
    </head>
    <body>
      <div id="app-root">${appRootInString}</div>
      <script>
        window['${storeKey}'] = ${JSON.stringify(store.getState())};
      </script>
      ${createScripts(entrypointBundles)}
    </body>
    </html>
  `;
};

export default makeHtml;

async function createStoreAndPrefetchData({
  requestUrl,
}) {
  const store = configureStore();
  const prefetch = routes[requestUrl] && routes[requestUrl].component.prefetch;
  prefetch && await store.dispatch(prefetch(requestUrl));
  return store;
}

function createScripts(src = []) {
  return src.map((s) => `<script src="/${s}"></script>`)
    .join('');
}

interface MakeHtml {
  (props: {
    entrypointBundles: string[],
    localServer: boolean,
    requestUrl: string,
    rootContainerPath: string,
    storeKey: string,
  }): Promise<string>;
}
