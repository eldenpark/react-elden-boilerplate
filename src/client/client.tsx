import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { Provider as ReduxProvider } from 'react-redux';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import appConfig from '@config/appConfig';
import configureStore from '@universal/state/configureStore';
import RootContainer from '@containers/app/RootContainer/RootContainer.web';

// import Logger from '@modules/Logger';

console.info('App (client.jsx) is running, NODE_ENV: %s', process.env.NODE_ENV);

const appRoot = document.getElementById('app-root');

(function setBabelPolyfill() {
  if ((typeof window !== 'undefined' && !window['_babelPolyfill']) 
    || (typeof global !== 'undefined' && !global['_babelPolyfill'])) {
    console.info(`babel-polyfill is imported, since it wasn't imported yet`);
    require('babel-polyfill');
  }
})();

const store = configureStore({
  initialState: window[appConfig.reduxStateKey],
});

ReactDOM.hydrate(
  <ReduxProvider store={store}>
    <BrowserRouter>
      <RootContainer/>
    </BrowserRouter>
  </ReduxProvider>,
  appRoot,
);
