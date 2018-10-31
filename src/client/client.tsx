import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import appConfig from '@config/appConfig';
import ClientApp from './ClientApp';
import configureStore from '@universal/state/configureStore';

console.info('App (client.jsx) is running, NODE_ENV: %s', process.env.NODE_ENV);

const appRoot = document.getElementById('app-root');

const apolloClient = new ApolloClient({ 
  cache: new InMemoryCache(),
  link: createHttpLink({
    uri: 'https://nx9zvp49q7.lp.gql.zone/graphql',
  }),
});

(function setBabelPolyfill() {
  if ((typeof window !== 'undefined' && !window['_babelPolyfill']) 
    || (typeof global !== 'undefined' && !global['_babelPolyfill'])) {
    console.info(`babel-polyfill is imported, since it wasn't imported yet`);
    require('babel-polyfill');
  }
})();

const reduxStore = configureStore({
  initialState: window[appConfig.reduxStateKey],
});

ReactDOM.hydrate(
  <ClientApp
    apolloClient={apolloClient}
    reduxStore={reduxStore}
  />,
  appRoot,
);
