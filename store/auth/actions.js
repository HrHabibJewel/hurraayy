import axios from "axios";
import { LOGIN_API_URL, LOGIN_TOKEN } from "../../lib/constans";
import StorageService from "../../lib/storage.service";
//import request from "../../lib/utils/request";

export const actionTypes = {
  AUTH_START: "AUTH_START",
  AUTH_SUCCESS: "AUTH_SUCCESS",
  AUTH_FAIL: "AUTH_FAIL",
  AUTH_WELCOME: "AUTH_WELCOME",
  AUTH_LOGOUT: "AUTH_LOGOUT"
};

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = (step, token, userInfo) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    payload: {
      step: step,
      idToken: token,
      userInfo: userInfo
    }
  };
};

export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  };
};

export const authWelcome = () => {
  return {
    type: actionTypes.AUTH_WELCOME
  };
};

export const authLogout = () => {
  axios.defaults.headers.common["Authorization"] = "";
  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

export const auth = (email, pass) => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      dispatch(authStart());
      const requestBody = {
        usr: email,
        pwd: pass
      };
      const config = {
        headers: {
          Authorization: LOGIN_TOKEN,
          "Content-Type": "application/json"
        }
      };
      axios.defaults.validateStatus = (status) => {
        if(status < 300 || status == 400 || status == 422 || status == 500) {
          return status;
      }
    };

      axios
        .post(LOGIN_API_URL, requestBody, config)

        // request("/open/login", { method: "post", data: requestBody })
        .then(function(resp) {
          if(resp && resp.data && resp.status == 200) {
            let token = resp.data.access_token;
            //delete axios.defaults.headers.common["Authorization"];
            // axios.defaults.headers.common["Content-Type"] = "application/json";
            //axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            let _rTokenInfo = {
              refresh_token: resp.data.refresh_token,
              expires_in:resp.data.expires_in
            }
            StorageService.saveRefreshToken(_rTokenInfo);
            StorageService.saveToken(token);
            localStorage.setItem("step", 1);
            StorageService.saveUserInfo(resp.data.user);
          //  localStorage.setItem("user", JSON.stringify(resp.data.user));
            dispatch(authSuccess(1, token, resp.data.user));
            resolve(resp);
          }
        })
        .catch((err, xx) => {
          if(err.response != undefined) {
            dispatch(authFail(err.response.data.error));
          }
          reject(err);
        });
    });
  };
};
