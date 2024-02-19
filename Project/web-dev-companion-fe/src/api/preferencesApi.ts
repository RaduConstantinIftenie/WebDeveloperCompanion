import axios from "axios";
import { Preferences } from "../core/types/preferenceApiTypes";

const url =
  "https://ucr0s0omdj.execute-api.eu-west-1.amazonaws.com/dev/api/v1/wed/users";
const apiKey = "azGBj7C9nraQw3Rx13w5y5dO0mkfHvXI1LhGGwDV";

export const getPreferences = async (userId: string): Promise<Preferences> =>
  await new Promise<Preferences>((resolve, reject) => {
    axios
      .get(`${url}/${userId}/preferences`, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "x-api-key": apiKey,
        },
      })
      .then((data) => resolve(data.data))
      .catch((error) => reject(error));
  });

export const addPreferences = async (
  userId: string,
  preferences: Preferences
): Promise<Preferences> =>
  await new Promise<Preferences>((resolve, reject) => {
    axios
      .post(`${url}/${userId}/preferences`, preferences, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "x-api-key": apiKey,
        },
      })
      .then((data) => resolve(data.data))
      .catch((error) => reject(error));
  });

export const updatePreferences = async (
  userId: string,
  preferences: Preferences
): Promise<Preferences> =>
  await new Promise<Preferences>((resolve, reject) => {
    axios
      .put(`${url}/${userId}/preferences`, preferences, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "x-api-key": apiKey,
        },
      })
      .then((data) => resolve(data.data))
      .catch((error) => reject(error));
  });

export const deletePreferences = async (
  userId: string,
  preferenceIds: string[]
): Promise<Preferences> => {
  let composedUrl = `${url}/${userId}/preferences`;

  if (preferenceIds?.length > 0) {
    const ids = preferenceIds.map((preference) => `filters=${preference}`);
    composedUrl += `?${ids.join("&")}`;
  }

  return await new Promise<Preferences>((resolve, reject) => {
    axios
      .delete(composedUrl, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "x-api-key": apiKey,
        },
      })
      .then((data) => resolve(data.data))
      .catch((error) => reject(error));
  });
};
