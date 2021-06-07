import { actionTypes } from "./actions";
import { updateObject, resetObject } from "../../lib/utils/utility";
import StorageService from "../../lib/storage.service";

const initialState = {
  currentPageName: "",
  propertyId: 0
};

const propertyDestroy = state => {
  StorageService.destroyAdventureForm();
  return resetObject();
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADVENTURE_FORM:
      let obj = {
        currentPageName: action.payload.currentPageName,
        propertyId: action.payload.propertyId
      };
      return updateObject(state, obj);
    case actionTypes.PROPERTY_FORM_DESTROY:
      return propertyDestroy(state, action);
    default:
      return state;
  }
};

export default reducer;
