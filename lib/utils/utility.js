import { $axios } from "../http-service";
import StorageService from "../storage.service";
const isServer = typeof window === "undefined";
export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties,
  };
};

export const resetObject = () => {
  return {};
};

export async function getAdvFormEditData(property_id = 0) {
  let accommodationForm = !isServer ? JSON.parse(StorageService.getAdventureForm()) : {};
  if (!property_id && accommodationForm && accommodationForm["propertyId"]) {
    property_id = accommodationForm["propertyId"];
  }
  if (!property_id) {
    return null;
  }
  const response = await $axios
    .get("properties/" + property_id)
    .then(function (resp) {
      if (resp && resp.status == 200) {
        return resp.data;
      }
    });
  return response;
}

/* For Experience */

export async function getExperienceFormEditData(experienceId = 0) {
  let experienceForm = !isServer ? JSON.parse(StorageService.getExperienceForm()) : {};
  if (!experienceId && experienceForm && experienceForm["experienceId"]) {
    experienceId = experienceForm["experienceId"];
  }
  if (!experienceId) {
    return null;
  }
  const response = await $axios
    .get("experience/" + experienceId)
    .then(function (resp) {
      if (resp && resp.status == 200) {
        return resp.data;
      }
    });
  return response;
}

export function getExperienceId() {
  let experienceForm = !isServer ? JSON.parse(StorageService.getExperienceForm()) : {};
  // if(experienceForm != null && experienceForm["experienceId"] == undefined) {
  //   return null;
  // }
  // return experienceForm["experienceId"];
  //let experienceId = null;
  if (experienceForm && experienceForm["experienceId"]) {
   return experienceForm["experienceId"];
  }

    return null;
}

export function getExperiencePhotoId() {
  let experienceForm = !isServer ? JSON.parse(StorageService.getExperienceForm()) : {};
  if (experienceForm && experienceForm["photoId"]) {
   return experienceForm["photoId"];
  }

    return 0;
}


/* For Adventure */

export async function getAdventureHostEditData(adventureId = 0) {
  let adventureHost = !isServer ? JSON.parse(StorageService.getAdventureHost()) : {};
  if (!adventureId && adventureHost && adventureHost["adventureId"]) {
    adventureId = adventureHost["adventureId"];
  }
  if (!adventureId) {
    return null;
  }
  const response = await $axios
    .get("adventure/" + adventureId)
    .then(function (resp) {
      if (resp && resp.status == 200) {
        return resp.data;
      }
    });
  return response;
}

export function getAdventureId() {
  let adventureHost = !isServer ? JSON.parse(StorageService.getAdventureHost()) : {};
  // if(adventureHost != null && adventureHost["adventureId"] == undefined) {
  //   return null;
  // }
  // return adventureHost["adventureId"];
  //let adventureId = null;
  if (adventureHost && adventureHost["adventureId"]) {
   return adventureHost["adventureId"];
  }

    return null;
}

export function getAdventurePhotoId() {
  let adventureHost = !isServer ? JSON.parse(StorageService.getAdventureHost()) : {};
  if (adventureHost && adventureHost["photoId"]) {
   return adventureHost["photoId"];
  }

    return 0;
}

export function getAuthentication() {
  let isAuthenticate = false;
  if(!isServer) {
    let userInfo = StorageService.getUserInfo();
    if(userInfo && Object.keys(userInfo).length > 0) {
      isAuthenticate = true;
    }
  }
  return isAuthenticate;
}

export function encryption(data) {
   let encryption = Buffer.from(JSON.stringify(data)).toString("base64");
   return encryption;
}


export function decryption(data) {
  // if(isServer) {
  //   decryption = JSON.parse(Buffer.from(data, "base64").toString("ascii"));
  // }
  let decryption = JSON.parse(Buffer.from(data, "base64").toString("ascii"));

  return decryption;
}
