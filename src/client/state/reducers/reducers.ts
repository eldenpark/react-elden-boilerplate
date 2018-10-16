import { combineReducers, Reducer } from 'redux';

import fooReducer from './fooReducer';

const rootReducer: Reducer<State> = combineReducers({
  foo: fooReducer,
});

export default rootReducer;

export interface State {
  foo: any,
};
