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
import { cloudinaryUpload } from "../utils/utility";

export const outfitDetailsAction = (capturedImage) => async (dispatch) => {
  try {
    dispatch({ type: OUTFIT_DETAILS_REQUEST });

    const uploadedImageUrl = await cloudinaryUpload(capturedImage);
    let savedData = sessionStorage.getItem("outfitDetails") || {};
    if (
      (uploadedImageUrl && sessionStorage.getItem("outfitDetails") === null) ||
      sessionStorage.getItem("outfitDetails") === undefined
    ) {
      // "https://wearpair-backend.vercel.app/api/image-details/generate"
      const { data } = await axios.post(
        "https://wearpair-backend.vercel.app/api/image-details/generate",
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
    savedData = JSON.parse(savedData);
    if (savedData?.complementary_colors) {
      Object.keys(savedData.complementary_colors).forEach((category, index) => {
        const categoryData = savedData.complementary_colors[category];
        if (index === 0) {
          categoryData.recommended_types.forEach((type, index) => {
            if (index === 0) {
              dispatch(
                outfitFilterImagesAction(
                  category, // topwear, bottomwear, jackets, etc.
                  savedData.gender || "Unisex",
                  savedData.primary_color_details?.hex_codes[0].replace(
                    "#",
                    ""
                  ) || "000000", // Default to black if no color
                  type.title
                )
              );
            }
          });
        }
      });
    }
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

export const resetOutfitDetails = () => (dispatch) => {
  dispatch({ type: OUTFIT_DETAILS_RESET });
};

export const clearSessionStorage = () => {
  sessionStorage.removeItem("outfitDetails");
};

export const outfitFilterImagesAction =
  (category, gender, color, title) => async (dispatch, getState) => {
    try {
      dispatch({ type: OUTFIT_FILTER_IMAGES_REQUEST });
      const { data } = await axios.get(
        `https://wearpair-backend.vercel.app/api/image-details/filter/images?category=${category}&gender=${gender}&color=${color}&title=${title}`
      );
      dispatch({ type: OUTFIT_FILTER_IMAGES_SUCCESS, payload: data });
      const { outfitDetails } = getState();
      let updatedOutfitDetails = { ...outfitDetails.outfit };
      const updateRecommendedTypesWithImages = (recommendedTypes) => {
        return recommendedTypes.map((type) => {
          const matchingImage =
            data?.title?.toLowerCase() === type.title.toLowerCase();
          return {
            ...type,
            image: matchingImage ? data?.images : [], // Add image URL if found
          };
        });
      };
      if (updatedOutfitDetails.complementary_colors) {
        Object.keys(updatedOutfitDetails.complementary_colors).forEach(
          (key) => {
            if (
              updatedOutfitDetails.complementary_colors[key].recommended_types
            ) {
              updatedOutfitDetails.complementary_colors[key].recommended_types =
                updateRecommendedTypesWithImages(
                  updatedOutfitDetails.complementary_colors[key]
                    .recommended_types
                );
            }
          }
        );
      }

      dispatch({
        type: OUTFIT_FILTER_IMAGES_SUCCESS,
        payload: updatedOutfitDetails,
      });
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
