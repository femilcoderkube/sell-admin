import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../axios";
import toast from "react-hot-toast";

// Async thunk to update stage group data
export const updateStageGroup = createAsyncThunk(
  "stageGroup/updateStageGroup",
  async (
    { stageGroupId, groups }: { stageGroupId: string; groups: any[] },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(
        `/StageGroup?id=${stageGroupId}`,
        { groups }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update stage group data"
      );
    }
  }
);

// Initial state
const initialState = {
  stageGroups: null,
  loading: false,
  error: null,
};

// Create the slice
const stageGroupSlice = createSlice({
  name: "stageGroup",
  initialState,
  reducers: {
    // Reducer to reset the state
    resetStageGroup: (state) => {
      state.stageGroups = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle pending state (when API call is in progress)
    builder.addCase(updateStageGroup.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    // Handle fulfilled state (when API call succeeds)
    builder.addCase(updateStageGroup.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      toast.success("Great! The group update was successful.");
    });
    // Handle rejected state (when API call fails)
    builder.addCase(updateStageGroup.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

// Export actions
export const { resetStageGroup } = stageGroupSlice.actions;

// Export reducer
export default stageGroupSlice.reducer;
