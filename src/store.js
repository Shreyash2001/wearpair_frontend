import {
  combineReducers,
  applyMiddleware,
  legacy_createStore as createStore,
} from "redux";
import { thunk } from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";
import { outfitDetailsReducer } from "./reducers/outfitReducers";

const reducer = combineReducers({
  outfitDetails: outfitDetailsReducer,
});

const middleware = [thunk];

const initialState = {};
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export { store };
