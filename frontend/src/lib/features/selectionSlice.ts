import { createSlice } from "@reduxjs/toolkit";

export const selectionSlice = createSlice({
  name: "selection",
  initialState: {
    employeeName: "",
    employeeStatus: "",
    employeeRole: "",
  },
  reducers: {
    select: (state, action) => {
      state.employeeName = action.payload.employeeName;
      state.employeeStatus = action.payload.employeeStatus;
      state.employeeRole = action.payload.employeeRole;
    },
  },
});

export const { select } = selectionSlice.actions;

export default selectionSlice.reducer;
