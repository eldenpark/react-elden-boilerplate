// import { AppContainer } from 'react-hot-loader';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import appConfig from '@config/appConfig';
import configureStore from '@client/state/configureStore';
import RootContainer from '@containers/app/RootContainer/RootContainer.web';

// import Logger from '@modules/Logger';

// Logger.info(`App is running on env: ${process.env.NODE_ENV}`);
console.log('client.jsx in env: %s', process.env.NODE_ENV);

const appRoot = document.getElementById('app-root');

(function setPolyfill() {
  if ((typeof window !== 'undefined' && !window._babelPolyfill) 
    || (typeof global !== 'undefined' && !global._babelPolyfill)) {
    console.info(`babel-polyfill is imported, since it wasn't imported yet`);
    require('babel-polyfill');
  }
})();

const store = configureStore({
  initialState: window[appConfig.reduxStateKey],
});

function render(Component) {
  ReactDOM.hydrate(
    <ReduxProvider store={store}>
      <BrowserRouter>
        <Component/>
      </BrowserRouter>
    </ReduxProvider>,
    appRoot,
  );
}

render(RootContainer);

if (module.hot) {
  module.hot.accept('./containers/app/RootContainer/RootContainer.web', () => {
    console.warn('Hot module replace');
    const component = require('./containers/app/RootContainer/RootContainer.web').default;
    render(component);
  })
}
