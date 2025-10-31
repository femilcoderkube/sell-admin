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

export const fetchLeagueTickets = createAsyncThunk(
  "leagueTickets/fetchLeagueTickets",
  async (
    {
      page,
      perPage,
      // searchTerm,
      partnerId,
      status,
    }: {
      page: number;
      perPage: number;
      //  searchTerm: string;
      partnerId: any;
      status: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get("/LeaguesTickets", {
        params: {
          page,
          limit: perPage,
          // searchKey: searchTerm,
          partnerId: partnerId,
          status,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching league tickets"
      );
    }
  }
);

export const fetchLeagueTicketById = createAsyncThunk(
  "leagueTickets/fetchLeagueTicketById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/league-ticket?id=${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching league ticket"
      );
    }
  }
);

const leagueTicketsSlice = createSlice({
  name: "leagueTickets",
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
      .addCase(fetchLeagueTickets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeagueTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload.data?.result;
        state.totalCount = action.payload.data.totalItem;
      })
      .addCase(fetchLeagueTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchLeagueTicketById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeagueTicketById.fulfilled, (state, action) => {
        state.loading = false;
        state.ticketDetail = action.payload.data;
      })
      .addCase(fetchLeagueTicketById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearchTerm, setPerPage, setPage, setStatus } =
  leagueTicketsSlice.actions;

export default leagueTicketsSlice.reducer;
