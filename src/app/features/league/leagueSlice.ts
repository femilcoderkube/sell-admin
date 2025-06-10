import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LeagueState, League } from "../../types";
import axiosInstance from "../../../axios";
import toast from "react-hot-toast";

const initialState: LeagueState = {
  leagues: [],
  loading: false,
  error: null,
  currentPage: 1,
  perPage: 10,
  totalCount: 0,
  searchTerm: "",
  leagueDetail: null,
};

export const fetchLeagues = createAsyncThunk(
  "leagues/fetchLeagues",
  async (
    {
      page,
      perPage,
      searchTerm,
    }: { page: number; perPage: number; searchTerm: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get("/leagues", {
        params: {
          page,
          limit: perPage,
          searchKey: searchTerm,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching leagues"
      );
    }
  }
);

export const fetchLeagueById = createAsyncThunk(
  "leagues/fetchLeagueById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/league?id=${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching league"
      );
    }
  }
);

export const addLeague = createAsyncThunk(
  "leagues/addLeague",
  async (league: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/Leagues", league, {
        headers: {
          // "Content-Type": "multipart/form-data",
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error adding league"
      );
    }
  }
);

export const updateLeague = createAsyncThunk(
  "leagues/updateLeague",
  async (
    { id, league }: { id: string; league: FormData },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(`/Leagues?id=${id}`, league, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating league"
      );
    }
  }
);

export const deleteLeague = createAsyncThunk(
  "leagues/deleteLeague",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/leagues?id=${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error deleting league"
      );
    }
  }
);

export const registerForLeague = createAsyncThunk(
  "leagues/registerForLeague",
  async (
    registration: {
      leagueId: string;
      userId: string;
      username: string;
      gameID: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/Participant", registration, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error registering for league"
      );
    }
  }
);

const leagueSlice = createSlice({
  name: "leagues",
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
      .addCase(fetchLeagues.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeagues.fulfilled, (state, action) => {
        state.loading = false;
        state.leagues = action.payload.data?.result;
        state.totalCount = action.payload.data.totalItem;
      })
      .addCase(fetchLeagues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchLeagueById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeagueById.fulfilled, (state, action) => {
        state.loading = false;
        state.leagueDetail = action.payload.data;
      })
      .addCase(fetchLeagueById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addLeague.pending, (state) => {
        state.loading = true;
      })
      .addCase(addLeague.fulfilled, (state) => {
        state.loading = false;
        toast.success("League added successfully!");
      })
      .addCase(addLeague.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to add league!");
      })
      .addCase(updateLeague.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateLeague.fulfilled, (state) => {
        state.loading = false;
        toast.success("League updated successfully!");
      })
      .addCase(updateLeague.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to update league!");
      })
      .addCase(deleteLeague.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteLeague.fulfilled, (state) => {
        state.loading = false;
        toast.success("League deleted successfully!");
      })
      .addCase(deleteLeague.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to delete league!");
      })
      .addCase(registerForLeague.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerForLeague.fulfilled, (state) => {
        state.loading = false;
        toast.success("Registered for league successfully!");
      })
      .addCase(registerForLeague.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to register for league!");
      });
  },
});

export const { setSearchTerm, setPerPage, setPage } = leagueSlice.actions;

export default leagueSlice.reducer;
