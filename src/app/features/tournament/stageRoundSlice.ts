import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axiosInstance from "../../../axios";

// Async thunk to fetch stage round data
export const fetchStageRound = createAsyncThunk(
  "stageRound/fetchStageRound",
  async (stageId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/StageRound?stageId=${stageId}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch stage round data"
      );
    }
  }
);

// Initial state
const initialState = {
  stageRound: null,
  loading: false,
  error: null,
};

// Create the slice
const stageRoundSlice = createSlice({
  name: "stageRound",
  initialState,
  reducers: {
    // Optional: Add a reducer to reset the state
    resetStageRound: (state) => {
      state.stageRound = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle pending state (when API call is in progress)
    builder.addCase(fetchStageRound.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    // Handle fulfilled state (when API call succeeds)
    builder.addCase(fetchStageRound.fulfilled, (state, action) => {
      state.loading = false;
      state.stageRound = action.payload.result;
      state.error = null;
    });
    // Handle rejected state (when API call fails)
    builder.addCase(fetchStageRound.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

// Export actions
export const { resetStageRound } = stageRoundSlice.actions;

// Export reducer
export default stageRoundSlice.reducer;
