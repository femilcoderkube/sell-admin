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

const tournamentMatchesSlice = createSlice({
  name: "tournamentMatches",
  initialState: {
    matches: [] as TournamentMatch[],
    matchesLoading: false,
    matchesError: null,
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
      });
  },
});

export default tournamentMatchesSlice.reducer;
