import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../axios";
import toast from "react-hot-toast";

// Async thunk to fetch battle royal scores
export const fetchBattleRoyalScores = createAsyncThunk(
  "battleRoyalScores/fetch",
  async (
    {
      stageId,
      roundId,
      groupId,
    }: { stageId: string; roundId: string; groupId: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axiosInstance.get(`/BattleRoyalScores`, {
        params: { stageId, roundId, groupId },
      });
      return data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch Battle Royale scores"
      );
    }
  }
);

// Initial state
const initialState = {
  scores: null,
  loading: false,
  error: null,
};

// Create the slice
const battleRoyalScoresSlice = createSlice({
  name: "battleRoyalScores",
  initialState,
  reducers: {
    // Reducer to reset the state
    resetBattleRoyalScores: (state) => {
      state.scores = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle fetchBattleRoyalScores pending state
    builder.addCase(fetchBattleRoyalScores.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    // Handle fetchBattleRoyalScores fulfilled state
    builder.addCase(fetchBattleRoyalScores.fulfilled, (state, action) => {
      state.loading = false;
      state.scores = action.payload;
      state.error = null;
    });
    // Handle fetchBattleRoyalScores rejected state
    builder.addCase(fetchBattleRoyalScores.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

// Export actions
export const { resetBattleRoyalScores } = battleRoyalScoresSlice.actions;

// Export reducer
export default battleRoyalScoresSlice.reducer;
