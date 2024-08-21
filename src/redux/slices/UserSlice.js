import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
  name: "user",
  initialState: {
    companyName: "",
    imageUrl: "",
    emailId: "",
    uid: "",
  },
  reducers: {
    setCompanyName: (state, action) => {
      state.companyName = action.payload;
    },
    setImageUrl: (state, action) => {
      state.imageUrl = action.payload;
    },
    setEmailId: (state, action) => {
      state.emailId = action.payload;
    },
    setUid: (state, action) => {
      state.uid = action.payload;
    },
  },
});

export const { setCompanyName, setImageUrl, setEmailId, setUid } =
  UserSlice.actions;
export default UserSlice.reducer;
