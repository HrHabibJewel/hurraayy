import StorageService from "../../lib/storage.service";
export const actionTypes = {
  ADVENTURE_HOST: "ADVENTURE_HOST",
  ADVENTURE_HOST_DESTROY: "ADVENTURE_HOST_DESTROY"
};

export const adventureHost = (currentPageName, adventureId, photoId = 0) => {
 // console.log("====", photoId)
  let obj = {
    currentPageName: currentPageName,
    adventureId: adventureId,
    photoId:photoId
  };
  StorageService.saveAdventureHost(JSON.stringify(obj));
  return (dispatch, getState) => {
    dispatch({
      type: actionTypes.ADVENTURE_HOST,
      payload: obj
    });
  };
};

export const adventureHostDestroy = () => {
  return {
    type: actionTypes.ADVENTURE_HOST_DESTROY
  };
 };
