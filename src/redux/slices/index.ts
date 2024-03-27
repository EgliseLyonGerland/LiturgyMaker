import { combineReducers } from "@reduxjs/toolkit";

import liturgies from "./liturgies";
import recitations from "./recitations";
import songs from "./songs";

const rootReducer = combineReducers({
  liturgies,
  songs,
  recitations,
});

export default rootReducer;
