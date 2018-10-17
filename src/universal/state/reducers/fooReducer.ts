import ActionType from '@constants/ActionType';
import { Reducer } from 'redux';

const initialState: FooState = {
  count: 0,
  number: 0,
};

const fooReducer: Reducer<FooState> = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.ADD_SUCCESS:
      return {
        ...state,
        count: state.count + 1,
      };
    case ActionType.FETCH_FOO:
      return {
        ...state,
        number: 7,
      };
    default: 
      return state;
  }
};

export default fooReducer;

interface FooState {
  count: number,
  number: number,
}
