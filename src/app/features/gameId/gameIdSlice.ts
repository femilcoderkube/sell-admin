import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GameIdsState } from "../../types";
import axiosInstance from "../../../axios";

const initialState: GameIdsState = {
  gameIds: [],
  loading: false,
  error: null,
};

export const fetchGameIds = createAsyncThunk(
  "gameIds/fetchGameIds",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/gameid");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching game IDs"
      );
    }
  }
);

const gameIdsSlice = createSlice({
  name: "gameIds",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGameIds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGameIds.fulfilled, (state, action) => {
        state.loading = false;
        state.gameIds = action.payload.data?.result;
      })
      .addCase(fetchGameIds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default gameIdsSlice.reducer;
