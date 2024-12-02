import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../../dataTypes/types/userType";

type APIState<T> = {
  isBusy?: boolean;
  data?: T;
  error?: string;
};

type UserApiState = {
  userFetch: APIState<User>;
  userJoin: APIState<User>;
  userCheckIn: APIState<User>;
  userDelete: APIState<null>;
};

const initialAPIState = <T>() => ({
  isBusy: false,
  data: null as T,
});

const initialState: UserApiState = {
  userFetch: initialAPIState<User>(),
  userJoin: initialAPIState<User>(),
  userCheckIn: initialAPIState<User>(),
  userDelete: initialAPIState<null>(),
};

const baseURL = "http://localhost:5000";

export const fetchUser = createAsyncThunk("user/fetchUser", async (userName: string) => {
  const response = await axios.get(`${baseURL}/api/user/${userName}`);
  return response.data.user;
});

export const joinUser = createAsyncThunk("user/joinUser", async ({ name, partySize }: { name: string; partySize: number }) => {
  const response = await axios.post(`${baseURL}/api/join`, { name, partySize });
  return response.data.user;
});

export const checkInUser = createAsyncThunk("user/checkInUser", async (name: string) => {
  const response = await axios.post(`${baseURL}/api/checkin`, { name });
  return response.data.user;
});

export const deleteUser = createAsyncThunk("user/deleteUser", async (name: string) => {
  await axios.delete(`${baseURL}/api/deleteUser`, { data: { name } });
  return null;
});

const UserApiSlice = createSlice({
  name: "userApiSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.userFetch.isBusy = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.userFetch.isBusy = false;
        state.userFetch.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.userFetch.isBusy = false;
      })
      .addCase(joinUser.pending, (state) => {
        state.userJoin.isBusy = true;
      })
      .addCase(joinUser.fulfilled, (state, action) => {
        state.userJoin.isBusy = false;
        state.userJoin.data = action.payload;
      })
      .addCase(joinUser.rejected, (state) => {
        state.userJoin.isBusy = false;
      })
      .addCase(checkInUser.pending, (state) => {
        state.userCheckIn.isBusy = true;
      })
      .addCase(checkInUser.fulfilled, (state, action) => {
        state.userCheckIn.isBusy = false;
        state.userCheckIn.data = action.payload;
      })
      .addCase(checkInUser.rejected, (state) => {
        state.userCheckIn.isBusy = false;
      })
      .addCase(deleteUser.pending, (state) => {
        state.userDelete.isBusy = true;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.userDelete.isBusy = false;
      })
      .addCase(deleteUser.rejected, (state) => {
        state.userDelete.isBusy = false;
      });
  },
});

export const UserApiReducer = UserApiSlice.reducer;
export const UserApiAction = UserApiSlice.actions;

// export const { setSocket, clearUser } = userSlice.actions;
// export default userSlice.reducer;
