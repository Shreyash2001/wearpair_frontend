import {
  OUTFIT_DETAILS_FAILED,
  OUTFIT_DETAILS_REQUEST,
  OUTFIT_DETAILS_RESET,
  OUTFIT_DETAILS_SUCCESS,
} from "../constants/outfitConstants";

export const outfitDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case OUTFIT_DETAILS_REQUEST:
      return {
        loading: true,
        success: false,
      };
    case OUTFIT_DETAILS_SUCCESS:
      return {
        loading: false,
        success: true,
        outfit: action.payload,
      };
    case OUTFIT_DETAILS_FAILED:
      return {
        loading: false,
        success: false,
        error: action.payload,
      };
    case OUTFIT_DETAILS_RESET:
      return {
        loading: false,
        success: false,
      };

    default:
      return state;
  }
};
