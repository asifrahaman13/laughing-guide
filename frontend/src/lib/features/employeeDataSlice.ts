import { createSlice } from "@reduxjs/toolkit";

type EmployeeData = {
  EmployeeId: string;
  EmployeeProfile: string;
  EmployeeEmail: string;
  EmployeeeRole: string;
  EmployeeStatus: string;
};

export const employeeDataSlice = createSlice({
  name: "employeeData",
  initialState: {
    employeeData: {
      EmployeeId: "",
      EmployeeProfile: "",
      EmployeeEmail: "",
      EmployeeeRole: "",
      EmployeeStatus: "",
    },
  },

  reducers: {
    setEmployeeData: (state, action) => {
      state.employeeData = action.payload;
      console.log("state.employeeData: ", JSON.stringify(state.employeeData));
    },
    updateemploeeData: (state, action) => {
      const { key, value } = action.payload;
      state.employeeData[key as keyof EmployeeData] = value;
      console.log(
        "state.employeeData: ",
        JSON.parse(JSON.stringify(state.employeeData)),
      );
    },
  },
});

export const { setEmployeeData, updateemploeeData } = employeeDataSlice.actions;

export default employeeDataSlice.reducer;
