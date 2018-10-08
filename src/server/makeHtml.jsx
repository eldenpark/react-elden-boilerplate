import { Provider as ReduxProvider } from 'react-redux';
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from 'react-router-dom';

import RootContainer from '@containers/app/RootContainer/RootContainer.web';

const App = ({
  requestUrl,
  store,
}) => {
  return (
    <ReduxProvider store={store}>
      <StaticRouter
        context={{}}
        location={requestUrl}>
        <RootContainer/>
      </StaticRouter>
    </ReduxProvider>
  );
};
  
export default function makeHtml({
  bundles,
  requestUrl = '',
  store,
  storeKey = 'REDUX_STATE_KEY__NOT_DEFINED',
}) {
  const element = (
    <App
      requestUrl={requestUrl}
      store={store}/>
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
      ${createScripts(bundles)}
    </body>
    </html>
  `;
};

function createScripts(src = []) {
  return src.map((s) => `<script src="/${s}"></script>`)
    .join('');
}
