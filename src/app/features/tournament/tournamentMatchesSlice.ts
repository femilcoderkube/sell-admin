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
}

interface AddScorePayload {
  matchId: string;
  opponent1Score: number;
  opponent2Score: number;
  description: string;
  attachment: string;
  submittedBy: string;
}

interface UpdateStageRoundPayload {
  stageId: string;
  roundId: string;
  startTime?: string;
  endTime?: string;
}

export const fetchTournamentMatches = createAsyncThunk(
  "tournaments/fetchTournamentMatches",
  async (payload: FetchTournamentMatchesPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/TournamentMatch?stageId=${payload.stageId}`,
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

export const updateStageRound = createAsyncThunk(
  "stageRounds/updateStageRound",
  async (payload: UpdateStageRoundPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/StageRound?id=${payload.roundId}`,
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

const tournamentMatchesSlice = createSlice({
  name: "tournamentMatches",
  initialState: {
    matches: [] as TournamentMatch[],
    matchesLoading: false,
    matchesError: null,
    roundsLoading: false,
    roundsError: null,
  } as TournamentState, // Extend TournamentState if needed
  reducers: {},
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
      });
  },
});

export default tournamentMatchesSlice.reducer;
