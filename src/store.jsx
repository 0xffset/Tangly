// eslint-disable-next-line import/no-extraneous-dependencies
import {thunk} from "redux-thunk";
// eslint-disable-next-line import/no-extraneous-dependencies
import { createStore, applyMiddleware } from "redux";
// eslint-disable-next-line import/no-extraneous-dependencies
import { composeWithDevTools } from "@redux-devtools/extension";

import rootReducer from "./reducers";

const middleware = [thunk];

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;