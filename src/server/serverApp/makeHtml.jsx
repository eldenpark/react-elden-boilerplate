import fs from 'fs';
import React from "react";
import { Provider as ReduxProvider } from 'react-redux';
import { renderToString } from "react-dom/server";
import { StaticRouter } from 'react-router-dom';

import Log from '@server/modules/Log';

const App = ({
  localServer,
  requestUrl,
  rootContainerPath = '',
  store,
}) => {
  Log.info('<App/> with rootContainerPath: %s', rootContainerPath);
  let RootContainerComponent;
  try {
    RootContainerComponent = localServer
      ? require(rootContainerPath).default
      : require('@containers/app/RootContainer/RootContainer.web').default;
  } catch (err) {
    Log.error('<App/> cannot find rootContainer at: %s', rootContainerPath, err);
    return () => <div>RootContainer not found</div>;
  }

  return (
    <ReduxProvider store={store}>
      <StaticRouter
        context={{}}
        location={requestUrl}
      >
        <RootContainerComponent/>
      </StaticRouter>
    </ReduxProvider>
  );
};
  
export default function makeHtml({
  entrypointBundles,
  localServer = false,
  requestUrl = '',
  rootContainerPath = '',
  store,
  storeKey = 'REDUX_STATE_KEY__NOT_DEFINED',
}) {
  const element = (
    <App
      localServer={localServer}
      requestUrl={requestUrl}
      rootContainerPath={rootContainerPath}
      store={store}
    />
  );
  const elementInString = renderToString(element);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>React SSR</title>
    </head>
    <body>
      <div id="app-root">${elementInString}</div>
      <script>
        window['${storeKey}'] = ${JSON.stringify(store)};
      </script>
      ${createScripts(entrypointBundles)}
    </body>
    </html>
  `;
};

function createScripts(src = []) {
  return src.map((s) => `<script src="/${s}"></script>`)
    .join('');
}
