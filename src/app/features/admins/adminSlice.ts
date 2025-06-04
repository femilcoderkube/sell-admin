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

export const addGame = createAsyncThunk(
  "admin/addGame",
  async (device: FormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/admin", device, {
        headers: {
          "Content-Type": "multipart/form-data",
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

export const updateGame = createAsyncThunk(
  "admin/updateGame",
  async (
    { id, device }: { id: string; device: FormData },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(`/admin?id=${id}`, device, {
        headers: {
          "Content-Type": "multipart/form-data",
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

export const deleteGame = createAsyncThunk(
  "admin/deleteGame",
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
      .addCase(addGame.pending, (state) => {
        state.loading = true;
      })
      .addCase(addGame.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateGame.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateGame.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateGame.rejected, (state, action) => {
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
      .addCase(deleteGame.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteGame.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearchTerm, setPerPage, setPage } = adminSlice.actions;

export default adminSlice.reducer;
