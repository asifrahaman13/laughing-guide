import { createSlice } from "@reduxjs/toolkit";

export const selectionSlice = createSlice({
  name: "selection",
  initialState: {
    employeeName: "",
    employeeStatus: "",
    employeeRole: "",
  },
  reducers: {
    selectEmployeeName: (state, action) => {
      const { employeeName } = action.payload;
      state.employeeName = employeeName;
    },
    selectEmployeeStatus: (state, action) => {
      const { employeeStatus } = action.payload;
      state.employeeStatus = employeeStatus;
    },

    setEmployeeRole: (state, action) => {
      const { employeeRole } = action.payload;
      state.employeeRole = employeeRole;
    },
  },
});

export const { selectEmployeeName, selectEmployeeStatus, setEmployeeRole } =
  selectionSlice.actions;

export default selectionSlice.reducer;
