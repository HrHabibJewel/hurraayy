import { actionTypes } from "./actions";
import { updateObject, resetObject } from "../../lib/utils/utility";
import StorageService from "../../lib/storage.service";

const initialState = {
  currentPageName: "",
  experienceId: 0,
  photoId : 0
};

const experienceFormDestroy = state => {
  localStorage.removeItem("experiencePhoto");
  StorageService.destroyExperienceForm();
  return resetObject();
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.EXPERIENCE_FORM:
      let obj = {
        currentPageName: action.payload.currentPageName,
        experienceId: action.payload.experienceId,
        photoId: action.payload.photoId
      };
      return updateObject(state, obj);
    case actionTypes.EXPERIENCE_FORM_DESTROY:
      return experienceFormDestroy(state, action);
    default:
      return state;
  }
};

export default reducer;