import { createStore, applyMiddleware, Store } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers/reducers';
import Logger from '@modules/Logger';

const logger = new Logger('action');

const reduxLogger = (store) => (next) => (action) => {
  logger.action(action.type, action);

  return next(action);
}

export default function configureStore(state = {}) {
  const store = createStore(
    reducers,
    applyMiddleware(thunk, reduxLogger),
  );

  if (module.hot) {
    module.hot.accept('./reducers/reducers', () => {
      const nextReducer = require('./reducers/reducers').default;
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
