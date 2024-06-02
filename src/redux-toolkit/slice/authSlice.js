import { createSlice } from "@reduxjs/toolkit";
import { registerUser, loginUser } from "../action/authAction";

const userToken = localStorage.getItem('userToken') || null;

const initialState = {
  loading: false,
  userInfo: {}, // for user object
  userToken: userToken, // for storing the JWT
  error: null,
  success: false,
  isLoggedIn: !!userToken,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    LOGOUT: (state) => {
      state.userInfo = {};
      state.userToken = null;
      state.isLoggedIn = false;
      localStorage.removeItem('userToken');
      localStorage.removeItem('displayName');
      localStorage.removeItem('displayEmail');
      localStorage.removeItem('password')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.userInfo = payload.data;
        state.userToken = payload.data.token;
        state.isLoggedIn = true;
        // localStorage.setItem("userToken", payload.data.token);
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload.message;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = payload.status === 0;
        state.error = payload.status !== 0 ? payload.message : null; // registration successful
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload.message;
      });
  },
});

export const { LOGOUT } = authSlice.actions;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectEmail = (state) => state.auth.userInfo.email;
export const selectUserID = (state) => state.auth.userInfo.id;
export const selectUserInfo = (state) => state.auth.userInfo;
export default authSlice.reducer;
