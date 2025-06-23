import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { rulesState } from "../../types";
import axiosInstance from "../../../axios";
import toast from "react-hot-toast";
import { TrophiesState } from "../../types";

const initialState: TrophiesState = {
  trophies: [],
  loading: false,
  error: null,
  currentPage: 1,
  perPage: 10,
  totalCount: 0,
  searchTerm: "",
  trophyDetail: null,
};

export const fetchTrophies = createAsyncThunk(
  "trophies/fetchTrophies",
  async (
    {
      page,
      perPage,
      searchTerm,
    }: { page: number; perPage: number; searchTerm: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get("/trophies", {
        params: {
          page,
          limit: perPage,
          searchKey: searchTerm,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching trophies"
      );
    }
  }
);

export const fetchTrophieById = createAsyncThunk(
  "trophies/fetchTrophieById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/trophies?id=${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching trophies"
      );
    }
  }
);

export const addTrophie = createAsyncThunk(
  "trophies/addTrophie",
  async (trophie: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/trophies", trophie, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error adding trophie"
      );
    }
  }
);

export const updateTrophie = createAsyncThunk(
  "trophies/updateTrophie",
  async (
    { id, trophie }: { id: string; trophie: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(`/trophies?id=${id}`, trophie, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating trophie"
      );
    }
  }
);

export const deleteTrophie = createAsyncThunk(
  "trophies/deleteTrophie",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/trophies?id=${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error deleting trophie"
      );
    }
  }
);

const trophiesSlice = createSlice({
  name: "trophies",
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
      .addCase(fetchTrophies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTrophies.fulfilled, (state, action) => {
        state.loading = false;
        state.trophies = action.payload.data?.result;
        state.totalCount = action.payload.data.totalItem;
      })
      .addCase(fetchTrophies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTrophieById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTrophieById.fulfilled, (state, action) => {
        state.loading = false;
        state.trophyDetail = action.payload.data;
      })
      .addCase(fetchTrophieById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addTrophie.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTrophie.fulfilled, (state) => {
        state.loading = false;
        toast.success("Trophy is created successfully.");
      })
      .addCase(addTrophie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to add trophie!");
      })
      .addCase(updateTrophie.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTrophie.fulfilled, (state) => {
        state.loading = false;
        toast.success("Trophy details are updated.");
      })
      .addCase(updateTrophie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to update trophie!");
      })
      .addCase(deleteTrophie.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTrophie.fulfilled, (state) => {
        state.loading = false;
        toast.success("Trophy is removed from the list.");
      })
      .addCase(deleteTrophie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});

export const { setSearchTerm, setPerPage, setPage } = trophiesSlice.actions;

export default trophiesSlice.reducer;
