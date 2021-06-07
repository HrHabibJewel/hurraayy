import StorageService from "../../lib/storage.service";
export const actionTypes = {
  EXPERIENCE_FORM: "EXPERIENCE_FORM",
  EXPERIENCE_FORM_DESTROY: "EXPERIENCE_FORM_DESTROY"
};

export const experienceForm = (currentPageName, experienceId, photoId = 0) => {
  let obj = {
    currentPageName: currentPageName,
    experienceId: experienceId,
    photoId:photoId
  };
  StorageService.saveExperienceForm(JSON.stringify(obj));
  return (dispatch, getState) => {
    dispatch({
      type: actionTypes.EXPERIENCE_FORM,
      payload: obj
    });
  };
};

export const experienceFormDestroy = () => {
  return {
    type: actionTypes.EXPERIENCE_FORM_DESTROY
  };
 };
