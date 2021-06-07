import StorageService from "../../lib/storage.service";
export const actionTypes = {
  ADVENTURE_FORM: "ADVENTURE_FORM",
  PROPERTY_FORM_DESTROY: "PROPERTY_FORM_DESTROY"
};

export const adventrueForm = (currentPageName, propertyId) => {
  let obj = {
    currentPageName: currentPageName,
    propertyId: propertyId
  };
  StorageService.saveAdventureForm(JSON.stringify(obj));
  return (dispatch, getState) => {
    dispatch({
      type: actionTypes.ADVENTURE_FORM,
      payload: obj
    });
  };
};

export const propertyDestroy = () => {
  return {
    type: actionTypes.PROPERTY_FORM_DESTROY
  };
 };
