import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { rulesState } from "../../types";
import axiosInstance from "../../../axios";
import toast from "react-hot-toast";
import { BadgeState, BadgeNameType } from "../../types";

const initialState: BadgeState = {
  badges: [],
  loading: false,
  error: null,
  currentPage: 1,
  perPage: 10,
  totalCount: 0,
  searchTerm: "",
  badgeDetail: null,
  badgeNames: [],
};

export const fetchBadges = createAsyncThunk(
  "badges/fetchBadges",
  async (
    {
      page,
      perPage,
      searchTerm,
    }: { page: number; perPage: number; searchTerm: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get("/badge", {
        params: {
          page,
          limit: perPage,
          searchKey: searchTerm,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching badges"
      );
    }
  }
);

export const fetchBadgesById = createAsyncThunk(
  "badges/fetchBadgesById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/badge?id=${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching badges"
      );
    }
  }
);

export const addBadges = createAsyncThunk(
  "badges/addBadges",
  async (badge: FormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/badge", badge, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error adding badge"
      );
    }
  }
);

export const updateBadges = createAsyncThunk(
  "badges/updateBadges",
  async (
    { id, badge }: { id: string; badge: FormData },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(`/badge?id=${id}`, badge, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating badge"
      );
    }
  }
);

export const deleteBadges = createAsyncThunk(
  "badges/deleteBadges",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/badge?id=${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error deleteing badge"
      );
    }
  }
);

export const fetchBadgeNames = createAsyncThunk(
  "badges/fetchBadgeNames",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/badge/names");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching badge names"
      );
    }
  }
);

const badgesSlice = createSlice({
  name: "badges",
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
      .addCase(fetchBadges.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBadges.fulfilled, (state, action) => {
        state.loading = false;
        state.badges = action.payload.data?.result;
        state.totalCount = action.payload.data.totalItem;
      })
      .addCase(fetchBadges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchBadgesById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBadgesById.fulfilled, (state, action) => {
        state.loading = false;
        state.badgeDetail = action.payload.data;
      })
      .addCase(fetchBadgesById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addBadges.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBadges.fulfilled, (state) => {
        state.loading = false;
        toast.success("Badge is added successfully.");
      })
      .addCase(addBadges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to add badge!");
      })
      .addCase(updateBadges.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBadges.fulfilled, (state) => {
        state.loading = false;
        toast.success("Changes are saved and updated.");
      })
      .addCase(updateBadges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to update badge!");
      })
      .addCase(deleteBadges.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBadges.fulfilled, (state) => {
        state.loading = false;
        toast.success("Badge is removed from the list.");
      })
      .addCase(deleteBadges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(fetchBadgeNames.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBadgeNames.fulfilled, (state, action) => {
        state.loading = false;
        state.badgeNames = action.payload.data || [];
      })
      .addCase(fetchBadgeNames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearchTerm, setPerPage, setPage } = badgesSlice.actions;

export default badgesSlice.reducer;
