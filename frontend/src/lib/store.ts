/* eslint-disable @typescript-eslint/no-unused-vars */
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import modalSlice from "./features/modalSlice";
import spinnerSlice from "./features/spinnerSlice";
import selectionSlice from "./features/selectionSlice";

export default configureStore({
  reducer: {
    modal: modalSlice,
    spinner: spinnerSlice,
    selection: selectionSlice,
  },
});

const rootReducer = combineReducers({
  modal: modalSlice,
  spinner: spinnerSlice,
  selection: selectionSlice,
});
export type RootState = ReturnType<typeof rootReducer>;
