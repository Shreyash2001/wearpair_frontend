import {
  OUTFIT_DETAILS_FAILED,
  OUTFIT_DETAILS_REQUEST,
  OUTFIT_DETAILS_RESET,
  OUTFIT_DETAILS_SUCCESS,
  OUTFIT_FILTER_IMAGES_FAILED,
  OUTFIT_FILTER_IMAGES_REQUEST,
  OUTFIT_FILTER_IMAGES_SUCCESS,
} from "../constants/outfitConstants";
import axios from "axios";
import { BASE_URI, cloudinaryUpload } from "../utils/utility";

export const outfitDetailsAction = (capturedImage) => async (dispatch) => {
  try {
    dispatch({ type: OUTFIT_DETAILS_REQUEST });

    const uploadedImageUrl = await cloudinaryUpload(capturedImage);
    let savedData = sessionStorage.getItem("outfitDetails") || {};
    if (
      (uploadedImageUrl && sessionStorage.getItem("outfitDetails") === null) ||
      sessionStorage.getItem("outfitDetails") === undefined
    ) {
      const { data } = await axios.post(
        `${BASE_URI}/api/image-details/generate`,
        {
          url: uploadedImageUrl,
        }
      );
      sessionStorage.setItem("outfitDetails", JSON.stringify(data));
      savedData = JSON.stringify(data);
    }
    dispatch({
      type: OUTFIT_DETAILS_SUCCESS,
      payload: JSON.parse(savedData),
    });
    setTimeout(() => {
      dispatch({ type: OUTFIT_DETAILS_RESET });
    }, 2000);
  } catch (error) {
    dispatch({
      type: OUTFIT_DETAILS_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const handleOutfitDetailsRefreshAction = () => async (dispatch) => {
  let savedData = sessionStorage.getItem("outfitDetails") || {};
  dispatch({
    type: OUTFIT_DETAILS_SUCCESS,
    payload: JSON.parse(savedData),
  });
  setTimeout(() => {
    dispatch({ type: OUTFIT_DETAILS_RESET });
  }, 2000);
  savedData = JSON.parse(savedData);

  if (savedData?.complementary) {
    let onceFlag = true;
    Object.keys(savedData?.complementary).forEach((category, index) => {
      const categoryData = savedData.complementary[category];

      if (categoryData?.recommended_types?.length > 0 && onceFlag) {
        if (
          categoryData?.recommended_types.some((type) => type.image?.length < 2)
        ) {
          const requests = {
            category,
            gender: savedData.gender || "Unisex",
            color: categoryData?.hex_codes[0]?.replace("#", "") || "000000",
            titles: [],
          };
          categoryData.recommended_types.forEach((type) => {
            requests.titles.push(type.title);
          });
          dispatch(outfitFilterImagesAction(requests));
          console.log("hello from refresh");
          onceFlag = false;
        }
      }
    });
  }
};

export const resetOutfitDetails = () => (dispatch) => {
  dispatch({ type: OUTFIT_DETAILS_RESET });
};

export const clearSessionStorage = () => {
  sessionStorage.removeItem("outfitDetails");
};

export const outfitFilterImagesAction =
  (requests) => async (dispatch, getState) => {
    try {
      dispatch({ type: OUTFIT_FILTER_IMAGES_REQUEST });

      const { data } = await axios.get(
        `${BASE_URI}/api/image-details/filter/images`,
        {
          params: {
            category: requests.category,
            gender: requests.gender,
            color: requests.color,
            titles: requests.titles,
          },
        }
      );

      const { outfitDetails } = getState();
      let updatedOutfitDetails = { ...outfitDetails.outfit };

      if (
        updatedOutfitDetails.complementary &&
        updatedOutfitDetails.complementary[data.category] &&
        updatedOutfitDetails.complementary[data.category].recommended_types
      ) {
        updatedOutfitDetails.complementary[data?.category].recommended_types =
          updatedOutfitDetails.complementary[
            data?.category
          ]?.recommended_types.map((type) => {
            const matchingData = data.results.find((data) => {
              return data.title.toLowerCase() === type.title.toLowerCase();
            });
            return {
              ...type,
              image: matchingData ? matchingData.images : [],
            };
          });
      }

      dispatch({
        type: OUTFIT_FILTER_IMAGES_SUCCESS,
        payload: updatedOutfitDetails,
      });
      sessionStorage.setItem(
        "outfitDetails",
        JSON.stringify(updatedOutfitDetails)
      );
    } catch (error) {
      dispatch({
        type: OUTFIT_FILTER_IMAGES_FAILED,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const outfitFilterForEachTabAction =
  (savedData, category) => (dispatch, getState) => {
    const { outfitDetails } = getState();
    const outfitDetailsData = outfitDetails.outfit;
    Object.keys(savedData).forEach((_, index) => {
      const categoryData = savedData[category];

      if (categoryData?.recommended_types?.length > 0) {
        if (
          categoryData?.recommended_types?.some(
            (type) => type?.image?.length < 2
          )
        ) {
          const requests = {
            category,
            gender: outfitDetailsData?.gender || "Unisex",
            color: categoryData?.hex_codes[0]?.replace("#", "") || "000000",
            titles: [],
          };
          categoryData.recommended_types.forEach((type) => {
            requests.titles.push(type.title);
          });
          dispatch(outfitFilterImagesAction(requests));
          console.log("hello from each tab");
        }
      }
    });
    return "";
  };
