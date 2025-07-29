import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../../axios";
import toast from "react-hot-toast";
import { TournamentState } from "../../types";

interface CreateMatchesPayload {
  stageId: string;
}

export const createMatches = createAsyncThunk(
  "tournaments/createMatches",
  async (payload: CreateMatchesPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/TournamentStage/create-matches",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.log("err create matches", error);
      return rejectWithValue(
        error.response?.data?.message || "Error creating matches"
      );
    }
  }
);

const createMatchesSlice = createSlice({
  name: "createMatches",
  initialState: {
    createMatchesLoading: false,
    createMatchesError: null,
  } as TournamentState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createMatches.pending, (state) => {
        state.createMatchesLoading = true;
        state.createMatchesError = null;
      })
      .addCase(createMatches.fulfilled, (state, action) => {
        state.createMatchesLoading = false;
        toast.success("Matches created successfully!");
      })
      .addCase(createMatches.rejected, (state, action) => {
        state.createMatchesLoading = false;
        state.createMatchesError = action.payload as string;
        toast.error("Failed to create matches!");
      });
  },
});

export default createMatchesSlice.reducer;
