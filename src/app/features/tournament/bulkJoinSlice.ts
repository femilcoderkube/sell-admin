import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../../axios";
import toast from "react-hot-toast";
import { TournamentState } from "../../types"; // Ensure types include BulkJoinPayload

interface BulkJoinPayload {
  tournament: string;
  participants: { team: string }[];
}

export const bulkJoinTournament = createAsyncThunk(
  "tournaments/bulkJoinTournament",
  async (payload: BulkJoinPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/TournamentParticipants/bulk",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.log("err bulk join", error);
      return rejectWithValue(
        error.response?.data?.message ||
          "Error adding participants to tournament"
      );
    }
  }
);

const bulkJoinSlice = createSlice({
  name: "bulkJoin",
  initialState: {
    bulkJoinLoading: false,
    bulkJoinError: null,
  } as TournamentState, // Extend TournamentState if needed
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(bulkJoinTournament.pending, (state) => {
        state.bulkJoinLoading = true;
        state.bulkJoinError = null;
      })
      .addCase(bulkJoinTournament.fulfilled, (state, action) => {
        state.bulkJoinLoading = false;
        // Optionally update participants or tournamentDetail in state if response includes relevant data
        toast.success("Participants added to tournament successfully!");
      })
      .addCase(bulkJoinTournament.rejected, (state, action) => {
        state.bulkJoinLoading = false;
        state.bulkJoinError = action.payload as string;
        toast.error("Failed to add participants to tournament!");
      });
  },
});

export default bulkJoinSlice.reducer;
