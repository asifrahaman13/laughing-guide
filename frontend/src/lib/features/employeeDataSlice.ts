import { createSlice } from "@reduxjs/toolkit";

type EmployeeData = {
  EmployeeId: string;
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
      EmployeeProfile: "",
      EmployeeEmail: "",
      EmployeeRole: "",
      EmployeeStatus: "",
    },
  },

  reducers: {
    setEmployeeData: (state, action) => {
      console.log("set employee data: ", action.payload);
      state.employeeData = action.payload;
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
