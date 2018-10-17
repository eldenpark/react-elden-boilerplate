import ActionType from '@constants/ActionType';

export const add = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        payload: 1,
        type: ActionType.ADD,
      });

      const asyncResult = await delay();
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

export function fetchFoo(url: string) {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: ActionType.FETCH_FOO,
      });
  
      const asyncResult = await delay();
      return dispatch({
        payload: {
          url,
          result: asyncResult,
        },
        type: ActionType.FETCH_FOO_SUCESS,
      });
    } catch (err) {
      return dispatch({
        error: true,
        payload: err,
        type: ActionType.FETCH_FOO_ERROR,
      });
    }
  };
};

function delay() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('async action success');
    }, 500);
  });
}
