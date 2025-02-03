import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  firstName: "",
  lastName: "",
  profilePicture: "",
  links: [],
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action) => {
      return { ...state, ...action.payload };
    },
    addlink: (state, action) => {
      state.links.push(action.payload);
    },
    removeLink: (state, action) => {
      state.links = state.links.filter((link) => link.id !== action.payload);
    },
  },
});

export const { setProfile, addlink, removeLink } = profileSlice.actions;
export default profileSlice.reducer;
