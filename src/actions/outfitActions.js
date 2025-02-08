import {
  OUTFIT_DETAILS_FAILED,
  OUTFIT_DETAILS_REQUEST,
  OUTFIT_DETAILS_RESET,
  OUTFIT_DETAILS_SUCCESS,
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
        "http://localhost:5000/api/image-details/extract-details",
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

export const resetOutfitDetails = () => (dispatch) => {
  dispatch({ type: OUTFIT_DETAILS_RESET });
};

export const clearSessionStorage = () => {
  sessionStorage.removeItem("outfitDetails");
};
