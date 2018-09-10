import ActionType from '@constants/ActionType';

export const REDUX_THUNK__add = (param) => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        payload: 1,
        type: ActionType.ADD,
      });

      const asyncResult = await REDUX_THUNK__addSuccees();
      dispatch({
        payload: asyncResult,
        type: ActionType.ADD_SUCCESS,
      });
    } catch (err) {
      dispatch({
        error: true,
        payload: err,
        type: ActionType.ADD_ERROR,
      });
    }
  };
};

function REDUX_THUNK__addSuccees() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('async action success');
    }, 500);
  });
}
