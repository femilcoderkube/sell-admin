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
  matcheDetail: null,
  participants: [],
  participantsLoading: false,
  participantsError: null,
  participantsCurrentPage: 1,
  participantsPerPage: 5,
  participantsTotalCount: 0,
  matches: [],
  matchesLoading: false,
  matchesError: null,
  matchesCurrentPage: 1,
  matchesPerPage: 5,
  matchesTotalCount: 0,
};

export const fetchLeagueMatches = createAsyncThunk(
  "leagues/fetchLeagueMatches",
  async (
    {
      leagueId,
      page,
      perPage,
    }: { leagueId: string; page: number; perPage: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(
        `/LeagueMatch?leagueId=${leagueId}&page=${page}&limit=${perPage}`
      );
      return response.data;
    } catch (error: any) {
      console.log("err", error);
      return rejectWithValue(
        error.response?.data?.message || "Error fetching league matches"
      );
    }
  }
);
export const fetchLeagueMatchesByID = createAsyncThunk(
  "leagues/fetchLeagueMatchesByID",
  async ({ matcheId }: { matcheId: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/LeagueMatch?id=${matcheId}`);
      return response.data;
    } catch (error: any) {
      console.log("err 1", error);

      return rejectWithValue(
        error.response?.data?.message || "Error fetching league matches"
      );
    }
  }
);
export const updateLeagueMatchesByID = createAsyncThunk(
  "leagues/updateLeagueMatchesByID", // Updated action type for clarity
  async (
    {
      matcheId,
      team1ScoreDetails,
      team2ScoreDetails,
      status,
      winner,
    }: {
      matcheId: string;
      team1ScoreDetails?: object;
      team2ScoreDetails?: object;
      status?: string;
      winner?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(`/LeagueMatch?id=${matcheId}`, {
        team1ScoreDetails,
        team2ScoreDetails,
        ...(status && { status }),
        ...(winner && { winner }),
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating league match"
      );
    }
  }
);

export const fetchLeagueParticipants = createAsyncThunk(
  "leagues/fetchLeagueParticipants",
  async (
    {
      leagueId,
      page,
      perPage,
    }: { leagueId: string; page: number; perPage: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(
        `/LeaguesParticipants?leagueId=${leagueId}&page=${page}&limit=${perPage}`
      );
      return response.data;
    } catch (error: any) {
      console.log("err 2", error);

      return rejectWithValue(
        error.response?.data?.message || "Error fetching league participants"
      );
    }
  }
);

export const fetchLeagues = createAsyncThunk(
  "leagues/fetchLeagues",
  async (
    {
      partnerId,
      page,
      perPage,
      searchTerm,
    }: { partnerId: string; page: number; perPage: number; searchTerm: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get("/leagues", {
        params: {
          partnerId: partnerId,
          page,
          limit: perPage,
          searchKey: searchTerm,
        },
      });
      return response.data;
    } catch (error: any) {
      console.log("err 3", error);

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
      const response = await axiosInstance.get(`/leagues?id=${id}`);
      return response.data;
    } catch (error: any) {
      console.log("err 4", error);

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
    setParticipantsPage: (state, action: PayloadAction<number>) => {
      state.participantsCurrentPage = action.payload;
    },
    setMatchesPage: (state, action: PayloadAction<number>) => {
      state.matchesCurrentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeagueMatches.pending, (state) => {
        state.matchesLoading = true;
      })
      .addCase(fetchLeagueMatches.fulfilled, (state, action) => {
        state.matchesLoading = false;
        state.matches = action.payload.data.result;
        state.matchesTotalCount = action.payload.data.totalItem;
      })
      .addCase(fetchLeagueMatches.rejected, (state, action) => {
        state.matchesLoading = false;
        state.matchesError = action.payload as string;
      })
      .addCase(fetchLeagueParticipants.pending, (state) => {
        state.participantsLoading = true;
      })
      .addCase(fetchLeagueParticipants.fulfilled, (state, action) => {
        state.participantsLoading = false;
        state.participants = action.payload.data.result;
        state.participantsTotalCount = action.payload.data.totalItem;
      })
      .addCase(fetchLeagueParticipants.rejected, (state, action) => {
        state.participantsLoading = false;
        state.participantsError = action.payload as string;
      })
      // ... other extraReducers remain unchanged
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
      .addCase(fetchLeagueMatchesByID.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeagueMatchesByID.fulfilled, (state, action) => {
        state.loading = false;
        state.matcheDetail = action.payload.data;
      })
      .addCase(fetchLeagueMatchesByID.rejected, (state, action) => {
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
      })
      .addCase(updateLeagueMatchesByID.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateLeagueMatchesByID.fulfilled, (state, action) => {
        state.loading = false;
        state.matcheDetail = action.payload.data;
        // Optionally update matches array if needed
        state.matches = state.matches.map((match) =>
          match.id === action.payload.data.id ? action.payload.data : match
        );
        toast.success("Match updated successfully!");
      })
      .addCase(updateLeagueMatchesByID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to update match!");
      });
  },
});

export const {
  setSearchTerm,
  setPerPage,
  setPage,
  setParticipantsPage,
  setMatchesPage,
} = leagueSlice.actions;

export default leagueSlice.reducer;
