import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axios";
import toast from "react-hot-toast";

interface NotInStageState {
  notInStageParticipants: any[]; // Replace with specific type, e.g., { team: string, name: string }[]
  loading: boolean;
  error: string | null;
}

const initialState: NotInStageState = {
  notInStageParticipants: [],
  loading: false,
  error: null,
};

export const fetchNotInStageParticipants = createAsyncThunk(
  "notInStage/fetchNotInStageParticipants",
  async (
    { tournamentId, stageId }: { tournamentId?: string; stageId?: string },
    { rejectWithValue }
  ) => {
    try {
      const params: { tournamentId?: string; stageId?: string } = {};
      if (tournamentId) params.tournamentId = tournamentId;
      if (stageId) params.stageId = stageId;

      const response = await axiosInstance.get(
        "/TournamentParticipants/not-in-stage"
      );
      return response.data;
    } catch (error: any) {
      console.log("err fetch not-in-stage participants", error);
      return rejectWithValue(
        error.response?.data?.message ||
          "Error fetching not-in-stage participants"
      );
    }
  }
);

const notInStageSlice = createSlice({
  name: "notInStage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotInStageParticipants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotInStageParticipants.fulfilled, (state, action) => {
        state.loading = false;
        state.notInStageParticipants = action.payload.data?.result || [];
      })
      .addCase(fetchNotInStageParticipants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to fetch not-in-stage participants!");
      });
  },
});

export default notInStageSlice.reducer;
