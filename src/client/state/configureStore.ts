import { createStore, applyMiddleware } from 'redux';
import { Dispatch } from 'react-redux';
import thunk, { ThunkAction, ThunkMiddleware } from 'redux-thunk';

import reducers, { State } from './reducers/reducers';
import Logger from '@modules/Logger';

const logger = new Logger('action');

const reduxLogger = (store) => (next) => (action) => {
  logger.action(action.type, action);

  return next(action);
}

export default function configureStore({
  initialState,
} = {
  initialState: {},
}) {
  Logger.info('redux store, initial state', initialState);
  const store = createStore(
    reducers,
    initialState,
    applyMiddleware(thunk as ThunkMiddleware<State>, reduxLogger),
  );

  if (module.hot) {
    module.hot.accept('./reducers/reducers', () => {
      const nextReducer = require('./reducers/reducers').default;
      store.replaceReducer(nextReducer);
    });
  }

  return store;
};

export interface ConnectedReduxProps {
  dispatch: Dispatch,
};
