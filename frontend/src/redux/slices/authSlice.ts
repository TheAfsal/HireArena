import axiosInstance from "@/app/api/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const verifyAuth = createAsyncThunk(
  "auth/verifyAuth",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return rejectWithValue("No token found");
      }

      const response = await axiosInstance.get("/user-service/api/auth/who-am-i");

      return {
        user: response.data.user,
        role: response.data.role,
        token: token,
      };
    } catch (error) {
      localStorage.removeItem("authToken");
      return rejectWithValue("Verification failed");
    }
  }
);

const initialState = {
  isAuthenticated: false,
  user: null,
  token:
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null,
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
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.loading = false;
    },
    loginFailure(state, action) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.role = null;
      state.loading = false;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.role = null;
      localStorage.removeItem("authToken");
    },
    logoutAdmin(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.role = null;
      localStorage.removeItem("authToken");
    },
    changeToken(state, action) {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.token = action.payload.token;
        state.loading = false;
      })
      .addCase(verifyAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.role = null;
        state.token = null;
        state.loading = false;
      });
  },
});

export const { loginSuccess, loginFailure, logout, changeToken, logoutAdmin } =
  authSlice.actions;

export default authSlice.reducer;
