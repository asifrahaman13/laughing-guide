import { createSlice } from "@reduxjs/toolkit";

export const employeeUpdateSlice = createSlice({
  name: "employeeModal",
  initialState: {
    isOpen: false,
  },
  reducers: {
    openModal: (state) => {
      console.log("Called openModal");
      state.isOpen = true;
      console.log("state.isOpen: ", state.isOpen);
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openModal, closeModal } = employeeUpdateSlice.actions;

export default employeeUpdateSlice.reducer;
