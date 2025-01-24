import {
  OUTFIT_DETAILS_FAILED,
  OUTFIT_DETAILS_REQUEST,
  OUTFIT_DETAILS_SUCCESS,
} from "../constants/outfitConstants";
import axios from "axios";
import { cloudinaryUpload } from "../utils/utility";

export const outfitDetailsAction = (capturedImage) => async (dispatch) => {
  try {
    dispatch({ type: OUTFIT_DETAILS_REQUEST });

    const uploadedImageUrl = await cloudinaryUpload(capturedImage);
    if (uploadedImageUrl) {
      const { data } = await axios.post(
        "https://wearpair-backend.vercel.app/api/image-details/generate",
        {
          url: uploadedImageUrl,
        }
      );

      dispatch({
        type: OUTFIT_DETAILS_SUCCESS,
        payload: data,
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
