import axios from "axios";
import { API_URL, API_OPEN_URL, LOGIN_TOKEN, MANAGEMENT_API_URL } from "./constans";
import StorageService from "./storage.service";
let token = process.browser ? StorageService.getToken() : "";
import { getAuthentication } from "./utils/utility";

const caxios = axios.create({
  baseURL: API_URL,
  timeout: 200000,
  headers: {
    // Authorization: "Bearer " + StorageService.getToken(),
    Authorization: "Bearer " + StorageService.getToken(),
    "Content-Type": "multipart/form-data",
    "Content-Type": "application/json",
  },
  transformRequest: [
    function (data, headers) {
      return data;
    },
  ],
  validateStatus: function (status) {
    if(status < 300 || status == 400 || status == 422) {
        return status;
    }
  }
});

const openAxios = axios.create({
  baseURL: API_OPEN_URL,
  timeout: 200000,
  headers: {
    Authorization: LOGIN_TOKEN,
    "Content-Type": "application/json",
  },
  transformRequest: [
    function (data, headers) {
      return data;
    },
  ],
});
const managementAxios = axios.create({
  baseURL: MANAGEMENT_API_URL,
  timeout: 200000,
  headers: {
    Authorization: LOGIN_TOKEN,
    "Content-Type": "application/json",
  },
  transformRequest: [
    function (data, headers) {
      return data;
    },
  ],
});
managementAxios.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${StorageService.getToken()}`;
  return config;
}, (err) => {

})
caxios.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${StorageService.getToken()}`;
  return config;
}, (err) => {

})
caxios.interceptors.response.use((res) => {
 // console.log("res11========", res)
  return res;
}, (err) => {
  // const originalRequest = err.config;
  // if(err.response && err.response.status == 401 && err.response.data && err.response.data.error == "invalid_token") {
  //   getRefreshToken()
  // }
});

  setInterval( function() { getRefreshToken() }, 2300000);


export function getRefreshToken() {
  if(getAuthentication()) {
  let refreshTokenInfo = StorageService.getRefreshToken();
  const requestBody = {
    refreshToken: refreshTokenInfo['refresh_token']};
  const config = {
    headers: {
      Authorization: LOGIN_TOKEN,
      "Content-Type": "application/json"
    }
  };
  let _url = API_OPEN_URL+"refresh";
  axios.put(_url, requestBody, config).then(function(resp) {
    if(resp && resp.status == 200) {
     
      let token = resp.data.access_token;
      let _rTokenInfo = {
        refresh_token: resp.data.refresh_token,
        expires_in:resp.data.expires_in
      }
      delete axios.defaults.headers.common["Authorization"];
      axios.defaults.headers.common['Content-Type'] = 'application/json';
      axios.defaults.headers.common['Authorization'] = 'Bearer '+token;
      StorageService.saveRefreshToken(_rTokenInfo);
      StorageService.saveToken(token);
    }
  })
}
}
export const $axios = caxios;
export const $openAxios = openAxios;
export const $managementAxios = managementAxios;


export default {
  $axios,
  $openAxios,
  $managementAxios,
};
