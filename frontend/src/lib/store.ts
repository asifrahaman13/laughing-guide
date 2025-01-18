/* eslint-disable @typescript-eslint/no-unused-vars */
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import modalSlice from "./features/modalSlice";
import spinnerSlice from "./features/spinnerSlice";
import selectionSlice from "./features/selectionSlice";
import conversationSlice from "./features/conversationSlice";

export default configureStore({
  reducer: {
    modal: modalSlice,
    spinner: spinnerSlice,
    selection: selectionSlice,
    conversation: conversationSlice,
  },
});

const rootReducer = combineReducers({
  modal: modalSlice,
  spinner: spinnerSlice,
  selection: selectionSlice,
  conversation: conversationSlice,
});
export type RootState = ReturnType<typeof rootReducer>;
