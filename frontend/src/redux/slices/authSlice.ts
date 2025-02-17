import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  error: null,
  token: typeof window !== 'undefined' ? localStorage.getItem("authToken") : null,
  role: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.error = null;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.loading = false;
    },
    loginFailure(state, action) {
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.token = null;
      state.role = null;
      localStorage.removeItem("authToken");
    },
    logoutAdmin(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.token = null;
      state.role = null;
      localStorage.removeItem("authToken");
    },
    changeToken(state, action) {
      state.token = action.payload;
    },
  }
});

export const { loginSuccess, loginFailure, logout, changeToken, logoutAdmin } =
  authSlice.actions;

export default authSlice.reducer;
