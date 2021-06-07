import { $axios } from "../http-service";

// for place setting

export const getPropertyTypes = () => {
  return $axios.get("property_types");
};
export const getCities = () => {
  return $axios.get("cities");
};
export async function getAdvFormEditData(property_id = 0) {
  // let property_id = 0;
  if (!property_id && advForm && advForm["propertyId"]) {
    property_id = advForm["propertyId"];
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
