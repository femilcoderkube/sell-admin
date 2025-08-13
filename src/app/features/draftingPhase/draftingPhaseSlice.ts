import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DraftingPhaseState } from "../../types"; // Adjust import based on your types file
import axiosInstance from "../../../axios";
import toast from "react-hot-toast";

interface DraftingPhasePayload {
  leagueId: string;
  totalTeams: number;
  totalPlayers: number;
  startTime: string;
  pickTimeSeconds: number;
  isUpdate: boolean;
}

interface DraftingPhaseState {
  data: any | null; // Replace 'any' with a specific type if available
  loading: boolean;
  error: string | null;
}

const initialState: DraftingPhaseState = {
  data: null,
  loading: false,
  error: null,
};

export const addDraftingPhase = createAsyncThunk(
  "draftingPhase/addDraftingPhase",
  async (
    { id, payload }: { id: string; payload: DraftingPhasePayload },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(
        `/DraftingPhase?id=${id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error creating drafting phase"
      );
    }
  }
);

export const fetchDraftingPhase = createAsyncThunk(
  "draftingPhase/fetchDraftingPhase",
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/DraftingPhase?id=${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching drafting phase"
      );
    }
  }
);

export const updateDraftpublish = createAsyncThunk(
  "eligiblePlayers/updateDraftpublish",
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/DraftingPhase/${id}/publish`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Error updating");
    }
  }
);

const draftingPhaseSlice = createSlice({
  name: "draftingPhase",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add Drafting Phase
      .addCase(addDraftingPhase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDraftingPhase.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        toast.success("Drafting phase created successfully!");
      })
      .addCase(addDraftingPhase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      // Fetch Drafting Phase
      .addCase(fetchDraftingPhase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDraftingPhase.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(fetchDraftingPhase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(updateDraftpublish.pending, (state) => {
        state.loading = true;
        state.error = null;
        toast.success("Drafting phase publish successfully!");
      })
      .addCase(updateDraftpublish.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateDraftpublish.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});

export default draftingPhaseSlice.reducer;
