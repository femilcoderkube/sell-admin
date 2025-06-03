import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, LoginRequest, LoginResponse } from "../../types";
import axiosInstance from "../../../axios";

const initialState: AuthState = {
  user: {
    _id: "",
    email: null,
    isSuperAdmin: false,
  },
  token: null,
  admin: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (loginRequest: LoginRequest, { rejectWithValue }) => {
    try {
      // API call to login with /admin/login
      const response = await axiosInstance.post<LoginResponse>(
        "/admin/login",
        loginRequest
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = { _id: "", email: null, isSuperAdmin: false };
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.loading = false;
          state.token = action.payload.data.token;
          state.admin = action.payload.data.admin;
          state.user = {
            _id: action.payload.data._id,
            email: action.payload.data.email,
            isSuperAdmin: action.payload.data.isSuperAdmin,
          };

          // Store the token in localStorage
          localStorage.setItem("token", action.payload.data.token);
          localStorage.setItem(
            "admin",
            JSON.stringify(action.payload.data.admin)
          );
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
