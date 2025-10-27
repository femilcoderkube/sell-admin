import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminState } from "../../types";
import axiosInstance from "../../../axios";

const initialState: AdminState = {
  admins: [],
  dashboard: [],
  dashboard2: [],
  role: null,
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
export const fetchDashboard = createAsyncThunk(
  "admin/fetchDashboard",
  async (id: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/admin/dashboard?id=${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching dashboard data"
      );
    }
  }
);
export const fetchDashboard2 = createAsyncThunk(
  "admin/fetchDashboard2",
  async (id: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/admin/dashboard2?id=${id}`);
      console.log("res", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching dashboard data"
      );
    }
  }
);
export const fetchRole = createAsyncThunk(
  "admin/fetchRole",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/admin/role");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching dashboard data"
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
  async ({ id, admin }: { id: string; admin: any }, { rejectWithValue }) => {
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
  "admins/fetchAdminById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/admin?id=${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching admins"
      );
    }
  }
);

export const checkAdminExists = createAsyncThunk(
  "admin/checkAdminExists",
  async (
    { email, userName }: { email?: string; userName?: string },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      if (email) params.append("email", email);
      if (userName) params.append("userName", userName);
      const response = await axiosInstance.get(
        `/admin/check?${params.toString()}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error checking admin existence"
      );
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
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload.data;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDashboard2.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboard2.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard2 = action.payload.data;
      })
      .addCase(fetchDashboard2.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRole.fulfilled, (state, action) => {
        state.loading = false;
        state.role = action.payload.data;
      })
      .addCase(fetchRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;

        localStorage.removeItem("token");
        localStorage.removeItem("admin");
        window.location.href = "/login";
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
      })
      .addCase(checkAdminExists.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAdminExists.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(checkAdminExists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearchTerm, setPerPage, setPage } = adminSlice.actions;

export default adminSlice.reducer;
