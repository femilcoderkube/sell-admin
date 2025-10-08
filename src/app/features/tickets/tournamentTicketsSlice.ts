import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../../axios";

const initialState: any = {
  tickets: [],
  loading: false,
  error: null,
  currentPage: 1,
  perPage: 10,
  totalCount: 0,
  searchTerm: "",
  ticketDetail: null,
  ticketNames: [],
  status: "",
};

export const fetchTournamentTickets = createAsyncThunk(
  "tournamentTickets/fetchTournamentTickets",
  async (
    {
      page,
      perPage,
      // searchTerm,
      status,
    }: {
      page: number;
      perPage: number;
      // searchTerm: string;
      status: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get("/TournamenrTickets", {
        params: {
          page,
          limit: perPage,
          // searchKey: searchTerm,
          status,
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching tournament tickets"
      );
    }
  }
);

export const fetchTournamentTicketById = createAsyncThunk(
  "tournamentTickets/fetchTournamentTicketById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/tournament-ticket?id=${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching tournament ticket"
      );
    }
  }
);

const tournamentTicketsSlice = createSlice({
  name: "tournamentTickets",
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
    setStatus(state, action: PayloadAction<"all" | "open" | "closed">) {
      state.status = action.payload;
      state.currentPage = 1; // Reset to first page on status change
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTournamentTickets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTournamentTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload.data?.result;
        state.totalCount = action.payload.data.totalItem;
      })
      .addCase(fetchTournamentTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTournamentTicketById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTournamentTicketById.fulfilled, (state, action) => {
        state.loading = false;
        state.ticketDetail = action.payload.data;
      })
      .addCase(fetchTournamentTicketById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearchTerm, setPerPage, setPage, setStatus } =
  tournamentTicketsSlice.actions;

export default tournamentTicketsSlice.reducer;
