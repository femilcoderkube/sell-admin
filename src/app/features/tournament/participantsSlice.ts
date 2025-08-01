import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../../axios";
import toast from "react-hot-toast";

interface Participant {
  id: string;
  name: string;
  // Add other participant fields as per your API response
}

interface ParticipantsState {
  participants: Participant[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  perPage: number;
  totalCount: number;
  searchTerm: string | null;
}

const initialState: ParticipantsState = {
  participants: [],
  loading: false,
  error: null,
  currentPage: 1,
  perPage: 10,
  totalCount: 0,
  searchTerm: "",
};

export const fetchParticipants = createAsyncThunk(
  "participants/fetchParticipants",
  async (
    {
      tournamentId,
      page,
      perPage,
      searchTerm,
    }: {
      tournamentId: string;
      page: number;
      perPage?: number;
      searchTerm: string | null;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get("/TournamentParticipants", {
        params: {
          tournamentId,
          page,
          limit: perPage,
          searchTerm: searchTerm || null,
        },
      });
      return response.data;
    } catch (error: any) {
      console.log("err fetch participants", error);
      return rejectWithValue(
        error.response?.data?.message || "Error fetching participants"
      );
    }
  }
);

export const deleteParticipant = createAsyncThunk(
  "participants/deleteParticipant",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/TournamentParticipants?id=${id}`
      );
      return response.data;
    } catch (error: any) {
      console.log("err delete participant", error);
      return rejectWithValue(
        error.response?.data?.message || "Error deleting participant"
      );
    }
  }
);

const participantsSlice = createSlice({
  name: "participants",
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
      .addCase(fetchParticipants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParticipants.fulfilled, (state, action) => {
        state.loading = false;
        state.participants = action.payload.data?.result || [];
        state.totalCount = action.payload.data?.totalItem || 0;
      })
      .addCase(fetchParticipants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to fetch participants!");
      })
      .addCase(deleteParticipant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteParticipant.fulfilled, (state) => {
        state.loading = false;
        toast.success("Participant deleted successfully!");
      })
      .addCase(deleteParticipant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to delete participant!");
      });
  },
});

export const { setSearchTerm, setPerPage, setPage } = participantsSlice.actions;

export default participantsSlice.reducer;
