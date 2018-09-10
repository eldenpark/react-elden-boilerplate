import ActionType from '@constants/ActionType';

const initialState = {
  count: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionType.ADD_SUCCESS:
      return {
        ...state,
        count: state.count + 1,
      };
    default: 
      return state;
  }
};
