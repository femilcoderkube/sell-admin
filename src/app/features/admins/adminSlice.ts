import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminState, } from "../../types";
import axiosInstance from "../../../axios";

const initialState: AdminState = {
  admins: [],
  loading: false,
  error: null,
  currentPage: 1,
  perPage: 10,
  totalCount: 0,
  searchTerm: "",
  adminDetail: null,
};

export const fetchAdmin = createAsyncThunk(
  "admin/fetchAdmin",
  async (
    {
      page,
      perPage,
      searchTerm,
    }: { page: number; perPage: number; searchTerm: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get("/admin", {
        params: {
          page,
          limit: perPage,
          searchKey: searchTerm,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching partners"
      );
    }
  }
);

export const addAdmin = createAsyncThunk(
  "admin/addAdmin",
  async (admin: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/admin", admin, {
        headers: {
         "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error adding device"
      );
    }
  }
);

export const updateAdmin = createAsyncThunk(
  "admin/updateAdmin",
  async (
    { id, admin }: { id: string; admin: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(`/admin?id=${id}`, admin, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error adding device"
      );
    }
  }
);

export const deleteAdmin = createAsyncThunk(
  "admin/deleteAdmin",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/admin?id=${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error adding device"
      );
    }
  }
);
export const fetchAdminById = createAsyncThunk(
  'admins/fetchAdminById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/admin?id=${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching admins');
    }
  }
);
const adminSlice = createSlice({
  name: "admins",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setPerPage: (state, action: PayloadAction<number>) => {
      state.perPage = action.payload;
      state.currentPage = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = action.payload.data?.result;
        state.totalCount = action.payload.data.totalItem;
      })
      .addCase(fetchAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAdmin.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAdmin.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAdminById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminById.fulfilled, (state, action) => {
        state.loading = false;
        state.adminDetail = action.payload.data;
      })
      .addCase(fetchAdminById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAdmin.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearchTerm, setPerPage, setPage } = adminSlice.actions;

export default adminSlice.reducer;
