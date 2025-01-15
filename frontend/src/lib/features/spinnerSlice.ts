import { createSlice } from "@reduxjs/toolkit";

export const spinnerSlice = createSlice({
  name: "spinner",
  initialState: {
    isLoading: false,
  },
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
  },
});

export const { startLoading, stopLoading } = spinnerSlice.actions;

export default spinnerSlice.reducer;
