import ApolloClient from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';
import { InMemoryCache } from "apollo-cache-inmemory";
import { Provider as ReduxProvider } from 'react-redux';
import * as React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from 'react-router-dom';
import { Store } from 'redux';

import ActionType from "@constants/ActionType";
import configureStore from '@universal/state/configureStore';
import Log, { expressLog } from '@server/modules/Log';
import routes from '@universal/routes';
import ServerApp from './ServerApp';

const FAKE_GRAPHQL_SERVER_URL_LAUNCHED_AS_TOOLS = 'http://localhost:5010/graphql';

const makeHtml: MakeHtml = async function ({
  entrypointBundles,
  requestUrl = '',
  rootContainerPath = '',
  storeKey = 'REDUX_STATE_KEY__NOT_DEFINED',
}) {
  const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: createHttpLink({
      fetch,
      uri: FAKE_GRAPHQL_SERVER_URL_LAUNCHED_AS_TOOLS,
    }),
    ssrMode: true,
  });
  const apolloState = apolloClient.extract();

  const reduxStore = await createStoreAndPrefetchData({
    requestUrl,
  });

  const appRoot = (
    <ServerApp
      apolloClient={apolloClient}
      requestUrl={requestUrl}
      rootContainerPath={rootContainerPath}
      reduxStore={reduxStore}
    />
  );
  const appRootInString = renderToString(appRoot);

  expressLog.debug('makeHtml() with store: %j', reduxStore.getState());
  expressLog.debug('appRootInString: %s', appRootInString);
  expressLog.debug('apollo state: %s', JSON.stringify(apolloState));

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>react-elden-boilerplate</title>
</head>
<body>
  <div id="app-root">${appRootInString}</div>
  <script>window['${storeKey}']=${JSON.stringify(reduxStore.getState())};</script>
  <script>window.__APOLLO_STATE__ = ${JSON.stringify(apolloState)};</script>
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

function createScripts(src: string[] = []) {
  return src.map((s) => `<script src="/bundle/${s}"></script>`)
    .join('');
}

interface MakeHtml {
    (props: {
    entrypointBundles: string[],
    requestUrl: string,
    rootContainerPath: string,
    storeKey: string,
  }): Promise<string>;
}
