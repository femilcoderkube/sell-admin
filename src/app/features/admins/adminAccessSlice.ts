import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../../axios";
import toast from "react-hot-toast";

interface AccessModule {
  _id: string;
  nameEn: string;
  nameAr: string;
  key: string;
  hasAccess: boolean;
  subModules: {
    _id: string;
    nameEn: string;
    nameAr: string;
    key: string;
    hasAccess: boolean;
  }[];
}

interface AdminAccessState {
  modules: AccessModule[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminAccessState = {
  modules: [],
  loading: false,
  error: null,
};

// Async thunk to fetch admin access data
export const fetchAdminAccess = createAsyncThunk(
  "adminAccess/fetchAdminAccess",
  async (adminId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/AdminAccess/check?id=${adminId}`
      );
      return response.data.data.modules;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "An error occurred while fetching data"
      );
    }
  }
);

export const updateAdminAccess = createAsyncThunk(
  "adminAccess/updateAdminAccess",
  async (
    { adminId, modules }: { adminId: string; modules: AccessModule[] },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(`/AdminAccess?id=${adminId}`, {
        modules,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating admin access"
      );
    }
  }
);

const adminAccessSlice = createSlice({
  name: "adminAccess",
  initialState,
  reducers: {
    clearAccessData: (state) => {
      state.modules = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminAccess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminAccess.fulfilled, (state, action) => {
        state.loading = false;
        state.modules = action.payload;
      })
      .addCase(fetchAdminAccess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateAdminAccess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminAccess.fulfilled, (state, action) => {
        state.loading = false;
        state.modules = action.payload.modules || [];
        toast.success("Access rights have been updated.");
      })
      .addCase(updateAdminAccess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAccessData } = adminAccessSlice.actions;
export default adminAccessSlice.reducer;
