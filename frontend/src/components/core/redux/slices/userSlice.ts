import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../dataTypes/types/userType";

export interface UserState {
  userInfo?: User;
  message?: string;
}

const initialState: UserState = {};

const UserSlice = createSlice({
  initialState,
  name: "userSlice",
  reducers: {
    setUserInfo(state, action: PayloadAction<User>) {
      state.userInfo = action.payload;
    },
    removeUserInfo(state) {
      state.userInfo = {};
    },
    updateUserInfo(state, action: PayloadAction<Partial<User>>) {
      state.userInfo = { ...state.userInfo, ...action.payload };
    },
    setErrorMessage(state, action: PayloadAction<string>) {
      state.message = action.payload;
    },
  },
});
export const UserReducer = UserSlice.reducer;
export const UserAction = UserSlice.actions;
