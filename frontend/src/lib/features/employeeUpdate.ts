import { createSlice } from "@reduxjs/toolkit";

export const employeeUpdateSlice = createSlice({
  name: "employeeModal",
  initialState: {
    isOpen: false,
  },
  reducers: {
    openModal: (state) => {
      state.isOpen = true;
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openModal, closeModal } = employeeUpdateSlice.actions;

export default employeeUpdateSlice.reducer;
