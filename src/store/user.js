import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    loggedInUser: (state, action) => {
      return action.payload;
    },
    logoutUser: (state) => {
      return null;
    },
  },
});

export default userSlice.reducer;

export const { loggedInUser, logoutUser } = userSlice.actions;
