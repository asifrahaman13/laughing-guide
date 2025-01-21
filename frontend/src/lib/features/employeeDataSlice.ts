import { createSlice } from "@reduxjs/toolkit";

type EmployeeData = {
  EmployeeId: string;
  EmployeeName: string;
  EmployeeProfile: string;
  EmployeeEmail: string;
  EmployeeRole: string;
  EmployeeStatus: string;
};

export const employeeDataSlice = createSlice({
  name: "employeeData",
  initialState: {
    employeeData: {
      EmployeeId: "",
      EmployeeName: "",
      EmployeeProfile: "",
      EmployeeEmail: "",
      EmployeeRole: "",
      EmployeeStatus: "",
    },
  },

  reducers: {
    setEmployeeData: (state, action) => {
      state.employeeData = action.payload;
    },
    updateemploeeData: (state, action) => {
      const { key, value } = action.payload;
      state.employeeData[key as keyof EmployeeData] = value;
    },
  },
});

export const { setEmployeeData, updateemploeeData } = employeeDataSlice.actions;

export default employeeDataSlice.reducer;
