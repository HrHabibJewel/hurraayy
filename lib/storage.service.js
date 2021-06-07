/*          token             */

const ID_TOKEN_KEY = "token";
const ADVENTURE_FORM = "adventure_form";
const ADVENTURE_HOST = "ADVENTURE_HOST";
const EXPERIENCE_FORM = "EXPERIENCE_FORM";
const USER_PROFILE = "userProfile"
const STEP = "step";
const REFRESH_TOKEN_KEY = "refresh_token_info";
export const getStep = () => {
  let step = process.browser ? localStorage.getItem(STEP) : "";
  return step;
}
export const getToken = () => {
  let token = process.browser ? localStorage.getItem(ID_TOKEN_KEY) : "";
  return token
  // let token_decode = "";
  // if (localStorage.getItem(ID_TOKEN_KEY) !== null) {
  //   token_decode = JSON.parse(
  //     Buffer.from(localStorage.getItem(ID_TOKEN_KEY), "base64").toString(
  //       "ascii"
  //     )
  //   );
  // }
  // token_decode = token_decode.slice(0, -5);
  // return token_decode;
};

export const saveToken = token => {
  window.localStorage.setItem(ID_TOKEN_KEY, token);
  // let update_token = token + "+next";
  // let token_encode = Buffer.from(JSON.stringify(update_token)).toString(
  //   "base64"
  // );
  // window.localStorage.setItem(ID_TOKEN_KEY, token_encode);
};

export const destroyToken = () => {
  window.localStorage.removeItem(ID_TOKEN_KEY);
};

/*      Refresh Token      */


export const getRefreshToken = () => {
  let token = process.browser ? JSON.parse(localStorage.getItem(REFRESH_TOKEN_KEY)) : "";
  return token
};

export const saveRefreshToken = rToken => {
  let _rToken = JSON.stringify(rToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, _rToken);
};

export const destroyRefreshToken = () => {
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
};



/*        User Info        */

const USER_INFO = "user";
export const getUserInfo = () => {
  let user_decode = "";
  let userInfo = process.browser ? localStorage.getItem(USER_INFO) : null;
  if (userInfo !== null) {
    user_decode = JSON.parse(
      Buffer.from(userInfo, "base64").toString("ascii")
    );
  }
  return user_decode;
};

export const saveUserInfo = user => {
  let user_encode = Buffer.from(JSON.stringify(user)).toString("base64");
  window.localStorage.setItem(USER_INFO, user_encode);
};

export const saveUserProfile = user => {
  let user_encode = Buffer.from(JSON.stringify(user)).toString("base64");
  window.localStorage.setItem(USER_PROFILE, user_encode);
};
export const getUserProfile = () => {
  let user_decode = "";
  let userInfo = process.browser ? localStorage.getItem(USER_PROFILE) : null;
  if (userInfo !== null) {
    user_decode = JSON.parse(
      Buffer.from(userInfo, "base64").toString("ascii")
    );
  }
  return user_decode;
};
export const destroyUserInfo = () => {
  window.localStorage.removeItem(USER_INFO);
  window.localStorage.removeItem(USER_PROFILE);
};

export const destroyUserProfile = () => {
  window.localStorage.removeItem(USER_PROFILE);
};
/*     adventure form      */
export const getAdventureForm = () => {
  return localStorage.getItem(ADVENTURE_FORM);
};

export const saveAdventureForm = data => {
  window.localStorage.setItem(ADVENTURE_FORM, data);
};

export const destroyAdventureForm = () => {
  window.localStorage.removeItem(ADVENTURE_FORM);
};


/*     experience form      */
export const getExperienceForm = () => {
  return localStorage.getItem(EXPERIENCE_FORM);
};

export const saveExperienceForm = data => {
  window.localStorage.setItem(EXPERIENCE_FORM, data);
};

export const destroyExperienceForm = () => {
  window.localStorage.removeItem(EXPERIENCE_FORM);
};

/*     adventure host      */
export const getAdventureHost = () => {
  return localStorage.getItem(ADVENTURE_HOST);
};

export const saveAdventureHost = data => {
  window.localStorage.setItem(ADVENTURE_HOST, data);
};

export const destroyAdventureHost = () => {
  window.localStorage.removeItem(ADVENTURE_HOST);
};

export default {
  getStep,
  getToken,
  saveToken,
  destroyToken,
  getRefreshToken,
  saveRefreshToken,
  destroyRefreshToken,
  getUserInfo,
  saveUserInfo,
  destroyUserInfo,
  getAdventureForm,
  saveAdventureForm,
  destroyAdventureForm,
  getExperienceForm,
  saveExperienceForm,
  destroyExperienceForm,
  getAdventureHost,
  saveAdventureHost,
  destroyAdventureHost,
  saveUserProfile,
  getUserProfile,
  destroyUserProfile
};
