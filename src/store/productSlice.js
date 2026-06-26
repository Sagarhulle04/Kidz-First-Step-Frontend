import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    allProducts: [],
    currentProduct: null,
  },
  reducers: {
    allProducts: (state, action) => {
      state.allProducts = action.payload;
    },
    particularProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
  },
});

export default productSlice.reducer;

export const { allProducts, particularProduct } = productSlice.actions;
