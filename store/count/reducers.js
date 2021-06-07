import { actionTypes } from "./actions";
import { updateObject } from "../../lib/utils/utility";

const exampleInitialState = {
  count: 0
};

export const reducer = (state = exampleInitialState, action) => {
  switch (action.type) {
    case actionTypes.INCREMENT:
      // return Object.assign({}, state, {
      //   count: state.count + 1
      // });
      //return { ...state, count: state.count + 1 };
      return updateObject(state, { count: state.count + 1 });
    case actionTypes.DECREMENT:
      // return Object.assign({}, state, {
      //   count: state.count - 1
      // });
      // return { ...state, count: state.count - 1 };
      return updateObject(state, { count: state.count - 1 });
    case actionTypes.RESET:
      // return Object.assign({}, state, {
      //   count: exampleInitialState.count
      // });
      // return { ...state, count: exampleInitialState.count };
      return updateObject(state, { count: exampleInitialState.count });
    default:
      return state;
  }
};

export default reducer;
