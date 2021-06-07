export const actionTypes = {
  INCREMENT: "INCREMENT",
  DECREMENT: "DECREMENT",
  RESET: "RESET"
};

export const incrementCount = () => {
  return (dispatch, getState) => {
    const { counter } = getState();
    dispatch({ type: actionTypes.INCREMENT, payload: counter });
  };
};

export const decrementCount = () => {
  return (dispatch, getState) => {
    const { counter } = getState();
    dispatch({ type: actionTypes.DECREMENT, payload: counter });
  };
};

export const resetCount = () => {
  return (dispatch, getState) => {
    dispatch({ type: actionTypes.RESET });
  };
};
