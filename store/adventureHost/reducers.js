import { actionTypes } from "./actions";
import { updateObject, resetObject } from "../../lib/utils/utility";
import StorageService from "../../lib/storage.service";

const initialState = {
  currentPageName: "",
  adventureId: 0,
  photoId : 0
};

const adventureHostDestroy = state => {
  localStorage.removeItem("adventurePhoto");
  StorageService.destroyAdventureHost();
  return resetObject();
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADVENTURE_HOST:
      let obj = {
        currentPageName: action.payload.currentPageName,
        adventureId: action.payload.adventureId,
        photoId: action.payload.photoId
      };
      return updateObject(state, obj);

    case actionTypes.ADVENTURE_HOST_DESTROY:
      return adventureHostDestroy(state, action);
    default:
      return state;
  }
};

export default reducer;