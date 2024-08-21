import { createSlice } from "@reduxjs/toolkit";

const invoiceSlice = createSlice({
  name: "allInvoice",
  initialState: {
    allInvoice: [],
  },
  reducers: {
    addInvoice: (state, action) => {
      state.allInvoice = action.payload;
    },
    removeInvoice: (state, action) => {
      state.allInvoice = state.allInvoice.filter(
        (items) => items.uid !== action.uid
      );
    },
  },
});

export const { addInvoice, removeInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer;
