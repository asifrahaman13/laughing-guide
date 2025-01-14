/* eslint-disable @typescript-eslint/no-unused-vars */
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import modalSlice from "./features/modalSlice";

export default configureStore({
  reducer: {
    modal: modalSlice,
  },
});

const rootReducer = combineReducers({
  modal: modalSlice,
});
export type RootState = ReturnType<typeof rootReducer>;
