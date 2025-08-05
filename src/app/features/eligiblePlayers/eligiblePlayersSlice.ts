import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../../axios";
import toast from "react-hot-toast";
import { EligiblePlayer, EligiblePlayersState } from "../../types";

interface EligiblePlayer {
  id: string;
  // Add other player properties as needed
  name?: string;
  status?: string;
}

interface EligiblePlayersState {
  eligiblePlayers: EligiblePlayer[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  perPage: number;
  totalPages: number;
  totalItem: number;
  searchTerm: string;
}

const initialState: EligiblePlayersState = {
  eligiblePlayers: [],
  loading: false,
  error: null,
  currentPage: 1,
  perPage: 10,
  totalPages: 0,
  totalItem: 0,
  searchTerm: "",
};

export const fetchEligiblePlayers = createAsyncThunk(
  "eligiblePlayers/fetchEligiblePlayers",
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/DraftingPhase/eligible-players?id=${id}`
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching eligible players"
      );
    }
  }
);

export const updateEligiblePlayers = createAsyncThunk(
  "eligiblePlayers/updateEligiblePlayers",
  async (
    { id, playerIds }: { id: string; playerIds: string[] },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(
        `/DraftingPhase/${id}/eligible-players`,
        { playerIds }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating eligible players"
      );
    }
  }
);

const eligiblePlayersSlice = createSlice({
  name: "eligiblePlayers",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setPerPage: (state, action: PayloadAction<number>) => {
      state.perPage = action.payload;
      state.currentPage = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEligiblePlayers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEligiblePlayers.fulfilled, (state, action) => {
        state.loading = false;
        state.eligiblePlayers = action.payload.data || [];
      })
      .addCase(fetchEligiblePlayers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(state.error || "Failed to fetch eligible players");
      })
      .addCase(updateEligiblePlayers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEligiblePlayers.fulfilled, (state, action) => {
        state.loading = false;
        toast.success("Eligible players updated successfully!");
      })
      .addCase(updateEligiblePlayers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(state.error || "Failed to update eligible players");
      });
  },
});

export const { setSearchTerm, setPerPage, setPage } =
  eligiblePlayersSlice.actions;

export default eligiblePlayersSlice.reducer;
