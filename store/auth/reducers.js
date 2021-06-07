import { actionTypes } from "./actions";
import { updateObject, resetObject } from "../../lib/utils/utility";
import StorageService from "../../lib/storage.service";

// const initialState = {
//   token: StorageService.getToken() || "",
//   userInfo: StorageService.getUserInfo() || {},
//   error: null,
//   loading: false
// };

const initialState = {};

const authStart = state => {
  return updateObject(state, { error: null, loading: true });
};

const authSuccess = (state, action) => {
  let obj = {
    token: action.payload.idToken,
    step: action.payload.step,
    userInfo: action.payload.userInfo,
    error: null,
    loading: false
  };
  //StorageService.saveUserInfo(obj);
  return updateObject(state, obj);
};

const authFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
};
const authWlecome = state => {
  localStorage.setItem("step", 2);
  return updateObject(state, {
    step: 2
  });
};

const authLogout = state => {
  localStorage.removeItem("step");
  localStorage.removeItem("user");
  StorageService.destroyAdventureForm();
  StorageService.destroyAdventureHost();
  StorageService.destroyExperienceForm();
  StorageService.destroyToken();
  StorageService.destroyRefreshToken();
  return resetObject();
  // let obj = {
  //   token: "",
  //   step: "",
  //   userInfo: {},
  //   error: null,
  //   loading: false
  // };
  //return updateObject(state, obj);
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state);
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_FAIL:
      return authFail(state, action);
    case actionTypes.AUTH_WELCOME:
      return authWlecome(state);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state);
    default:
      return state;
  }
};

export default reducer;
