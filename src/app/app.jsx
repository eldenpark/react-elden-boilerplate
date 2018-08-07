import { AppContainer } from 'react-hot-loader';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Logger from '@modules/Logger';

Logger.info(`App is running on env: ${process.env.NODE_ENV}`);

(function setPolyfill() {
  if ((typeof window !== 'undefined' && !window._babelPolyfill) 
    || (typeof global !== 'undefined' && !global._babelPolyfill)) {
    Logger.info(`babel-polyfill is imported, since it wasn't imported yet`);
    require('babel-polyfill');
  }
})();

(async function asyncInitRenderingAfterPolyfill() {
  const rootEl = document.getElementById('app-root');
  
  const [
    configureStore,
    RootContainer,
  ] = await Promise.all([
    import('@src/state/configureStore'),
    import('@containers/app/RootContainer/RootContainer.web'),
  ]);

  const store = configureStore.default();

  const render = (Component) => {
    ReactDOM.hydrate(
      <AppContainer warnings={false}>
        <Provider store={store}>
          <BrowserRouter>
            <Component/>
          </BrowserRouter>
        </Provider>
      </AppContainer>,
      rootEl,
    );
  };
  
  render(RootContainer.default);

  if (module.hot) {
    module.hot.accept('./containers/app/RootContainer/RootContainer.web', () => {
      Logger.warn('Hot Module Replace');
      const component = require('@containers/app/RootContainer/RootContainer.web').default;
      render(component);
    });
  }
})();
