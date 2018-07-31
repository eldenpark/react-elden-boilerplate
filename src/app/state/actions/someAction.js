import ActionType from '@constants/ActionType';

export const add_USING_REDUX_THUNK = (param) => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        payload: 1,
        type: ActionType.ADD,
      });

      const asyncResult = await asyncAction();
      dispatch({
        payload: asyncResult,
        type: ActionType.ADD_SUCCESS,
      });
    } catch (err) {
      dispatch({
        error: true,
        type: ActionType.ADD_ERROR,
      });
    }
  };
};

function asyncAction() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('async action success');
    }, 1000);
  });
}
