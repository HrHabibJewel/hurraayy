import { combineReducers } from "redux";

import counter from "./count/reducers";
import auth from "./auth/reducers";
import adventureForm from "./adventureForm/reducers";
import experienceForm from "./experienceForm/reducers";
import adventureHost from "./adventureHost/reducers";

export default combineReducers({
  counter,
  auth,
  adventureForm,
  experienceForm,
  adventureHost
});
