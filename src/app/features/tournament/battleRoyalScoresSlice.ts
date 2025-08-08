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

export const putBattleRoyalScores = createAsyncThunk(
  "battleRoyalScores/put",
  async (
    {
      stageId,

      battleRoyalScores,
    }: { stageId: string; battleRoyalScores: any },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axiosInstance.put(
        `/BattleRoyalScores`,
        { stageId, battleRoyalScores }
        // { params: { stageId } }
      );
      return data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update Battle Royale scores"
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
    builder
      .addCase(fetchBattleRoyalScores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBattleRoyalScores.fulfilled, (state, action) => {
        state.loading = false;
        state.scores = action.payload;
        state.error = null;
      })
      .addCase(fetchBattleRoyalScores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(putBattleRoyalScores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(putBattleRoyalScores.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        toast.success("Score Updated successfully!");
      })
      .addCase(putBattleRoyalScores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { resetBattleRoyalScores } = battleRoyalScoresSlice.actions;

// Export reducer
export default battleRoyalScoresSlice.reducer;
