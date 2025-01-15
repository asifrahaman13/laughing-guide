/* eslint-disable @typescript-eslint/no-unused-vars */
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import modalSlice from "./features/modalSlice";
import spinnerSlice from "./features/spinnerSlice";

export default configureStore({
  reducer: {
    modal: modalSlice,
    spinner: spinnerSlice,
  },
});

const rootReducer = combineReducers({
  modal: modalSlice,
  spinner: spinnerSlice,
});
export type RootState = ReturnType<typeof rootReducer>;
