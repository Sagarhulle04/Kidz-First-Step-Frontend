import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./productSlice.js";
import userSlice from "./user.js";

const store = configureStore({
  reducer: {
    product: productSlice,
    user: userSlice,
  },
});

export default store;
