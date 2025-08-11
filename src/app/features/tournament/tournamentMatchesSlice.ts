import { data } from "react-router-dom";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../../axios";
import toast from "react-hot-toast";
import { TournamentState } from "../../types"; // Ensure types include TournamentMatch

interface TournamentMatch {
  // Define the shape of your match data based on API response
  _id: string;
  stageId: string;
  teams: string[];
  // Add other relevant fields
}

interface FetchTournamentMatchesPayload {
  stageId: string;
  roundId?: string; // Optional
  status?: string; // Optional
  search?: string; // Optional
}
interface FetchTournamentMatchByIdPayload {
  id: string;
}

interface AddScorePayload {
  matchId: string;
  opponent1Score: number;
  opponent2Score: number;
  description: string;
  attachment: string;
  submittedBy: string;
}
interface AcceptScorePayload {
  matchId: string;
  scoreId: string;
}

interface UpdateStageRoundPayload {
  stageId: string;
  roundId: string;
  startTime?: string;
  endTime?: string;
  groupId?: string;
}
interface UpdateTournamentMatchPayload {
  id: string;
  startTime: string;
  endTime: string;
}

export const fetchTournamentMatches = createAsyncThunk(
  "tournaments/fetchTournamentMatches",
  async (payload: FetchTournamentMatchesPayload, { rejectWithValue }) => {
    try {
      // Build query string dynamically based on provided parameters
      const queryParams = new URLSearchParams();
      queryParams.append("stageId", payload.stageId);
      if (payload.roundId) queryParams.append("roundId", payload.roundId);
      if (payload.status) queryParams.append("status", payload.status);
      if (payload.search) queryParams.append("search", payload.search);

      const response = await axiosInstance.get(
        `/TournamentMatch?${queryParams.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      console.log("err fetch tournament matches", error);
      return rejectWithValue(
        error.response?.data?.message || "Error fetching tournament matches"
      );
    }
  }
);

export const fetchTournamentMatchById = createAsyncThunk(
  "tournaments/fetchTournamentMatchById",
  async (payload: FetchTournamentMatchByIdPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/TournamentMatch?id=${payload.id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      console.log("err fetching tournament match by id", error);
      return rejectWithValue(
        error.response?.data?.message || "Error fetching tournament match by ID"
      );
    }
  }
);

export const addScore = createAsyncThunk(
  "tournaments/addScore",
  async (payload: AddScorePayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/TournamentMatch/add-score`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      console.log("err adding score", error);
      return rejectWithValue(
        error.response?.data?.message || "Error adding score"
      );
    }
  }
);
export const acceptScore = createAsyncThunk(
  "tournaments/acceptScore",
  async (payload: AcceptScorePayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/TournamentMatch/accept-score`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      console.log("err adding score", error);
      return rejectWithValue(
        error.response?.data?.message || "Error adding score"
      );
    }
  }
);

export const updateStageRound = createAsyncThunk(
  "stageRounds/updateStageRound",
  async (payload: UpdateStageRoundPayload, { rejectWithValue }) => {
    try {
      const query = `/StageRound?id=${payload.roundId}${
        payload.groupId ? `&groupId=${payload.groupId}` : ""
      }`;
      const response = await axiosInstance.put(
        `${query}`,
        {
          startTime: payload.startTime,
          endTime: payload.endTime,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      console.log("err updating stage round", error);
      return rejectWithValue(
        error.response?.data?.message || "Error updating stage round"
      );
    }
  }
);

export const updateTournamentMatch = createAsyncThunk(
  "tournaments/updateTournamentMatch",
  async (payload: UpdateTournamentMatchPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/TournamentMatch?id=${payload.id}`,
        {
          startTime: payload.startTime,
          endTime: payload.endTime,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      console.log("err updating tournament match", error);
      return rejectWithValue(
        error.response?.data?.message || "Error updating tournament match"
      );
    }
  }
);

const tournamentMatchesSlice = createSlice({
  name: "tournamentMatches",
  initialState: {
    matches: [] as TournamentMatch[],
    matchesLoading: false,
    matchesError: null,
    roundsLoading: false,
    roundsError: null,
    singleMatch: undefined,
  } as TournamentState, // Extend TournamentState if needed
  reducers: {
    resetMatches: (state) => {
      state.matches = [];
      state.matchesError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTournamentMatches.pending, (state) => {
        state.matchesLoading = true;
        state.matchesError = null;
      })
      .addCase(fetchTournamentMatches.fulfilled, (state, action) => {
        state.matchesLoading = false;
        state.matches = action.payload.result; // Assuming API returns array of matches
        // toast.success("Tournament matches fetched successfully!");
      })
      .addCase(fetchTournamentMatches.rejected, (state, action) => {
        state.matchesLoading = false;
        state.matchesError = action.payload as string;
        // toast.error("Failed to fetch tournament matches!");
      })
      .addCase(addScore.pending, (state) => {
        state.matchesLoading = true;
        state.matchesError = null;
      })
      .addCase(addScore.fulfilled, (state, action) => {
        state.matchesLoading = false;
        toast.success("Score added successfully!");
      })
      .addCase(addScore.rejected, (state, action) => {
        state.matchesLoading = false;
        state.matchesError = action.payload as string;
        toast.error("Failed to add score!");
      })
      .addCase(acceptScore.pending, (state) => {
        state.matchesLoading = true;
        state.matchesError = null;
      })
      .addCase(acceptScore.fulfilled, (state, action) => {
        state.matchesLoading = false;
        toast.success("Score Accepted successfully!");
      })
      .addCase(acceptScore.rejected, (state, action) => {
        state.matchesLoading = false;
        state.matchesError = action.payload as string;
        toast.error("Failed to Accept score!");
      })
      .addCase(updateStageRound.pending, (state) => {
        state.roundsLoading = true;
        state.roundsError = null;
      })
      .addCase(updateStageRound.fulfilled, (state, action) => {
        state.roundsLoading = false;

        toast.success("Stage round updated successfully!");
      })
      .addCase(updateStageRound.rejected, (state, action) => {
        state.roundsLoading = false;
        state.roundsError = action.payload as string;
        toast.error("Failed to update stage round!");
      })
      .addCase(updateTournamentMatch.pending, (state) => {
        state.matchesLoading = true;
        state.matchesError = null;
      })
      .addCase(updateTournamentMatch.fulfilled, (state, action) => {
        state.matchesLoading = false;
        // Update the specific match in the state

        toast.success("Tournament match updated successfully!");
      })
      .addCase(updateTournamentMatch.rejected, (state, action) => {
        state.matchesLoading = false;
        state.matchesError = action.payload as string;
        toast.error("Failed to update tournament match!");
      })
      .addCase(fetchTournamentMatchById.pending, (state) => {
        state.matchesLoading = true;
        state.matchesError = null;
      })
      .addCase(fetchTournamentMatchById.fulfilled, (state, action) => {
        state.matchesLoading = false;
        state.singleMatch = action.payload; // Store the single match
      })
      .addCase(fetchTournamentMatchById.rejected, (state, action) => {
        state.matchesLoading = false;
        state.matchesError = action.payload as string;
        // toast.error("Failed to fetch tournament match!");
      });
  },
});

export const { resetMatches } = tournamentMatchesSlice.actions;
export default tournamentMatchesSlice.reducer;
