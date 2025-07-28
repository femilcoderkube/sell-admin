import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  TournamentState,
  Tournament,
  AssignTournamentPayload,
} from "../../types"; // Update types accordingly
import axiosInstance from "../../../axios";
import toast from "react-hot-toast";
import moment from "moment-timezone";

const initialState: TournamentState = {
  tournaments: [],
  loading: false,
  error: null,
  currentPage: 1,
  perPage: 10,
  totalCount: 0,
  searchTerm: "",
  tournamentDetail: null,
  operatorDetail: null,
  operators: [],
  operatorsLoading: false,
  operatorsError: null,
  operatorsCurrentPage: 1,
  operatorsPerPage: 10,
  operatorsTotalCount: 0,
  matcheDetail: null,
  participants: [],
  participantsLoading: false,
  participantsError: null,
  participantsCurrentPage: 1,
  participantsPerPage: 10,
  participantsTotalCount: 0,
  matches: [],
  matchesLoading: false,
  matchesError: null,
  matchesCurrentPage: 1,
  matchesPerPage: 10,
  matchesTotalCount: 0,
  tickets: [],
  ticketsLoading: false,
  ticketsError: null,
  ticketsTotalCount: 0,
  ticketsCurrentPage: 1,
  ticketsPerPage: 10,
  eligibleParticipants: [], // Adjust type based on API response (e.g., { team: string }[])
  eligibleParticipantsLoading: false,
  eligibleParticipantsError: null,
  eligibleParticipantsCurrentPage: 0,
  eligibleParticipantsPerPage: 10,
  eligibleParticipantsTotalCount: 0,
  eligibleParticipantsSearchTerm: "",
};

export const fetchTournaments = createAsyncThunk(
  "tournaments/fetchTournaments",
  async (
    {
      partnerId,
      page,
      perPage,
      searchTerm,
    }: { partnerId: string; page: number; perPage: number; searchTerm: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get("/Tournament", {
        params: {
          partnerId: partnerId,
          page,
          limit: perPage,
          searchKey: searchTerm,
        },
      });
      return response.data;
    } catch (error: any) {
      console.log("err 3", error);
      return rejectWithValue(
        error.response?.data?.message || "Error fetching tournaments"
      );
    }
  }
);

export const fetchTournamentById = createAsyncThunk(
  "tournaments/fetchTournamentById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/Tournament?id=${id}`);
      return response.data;
    } catch (error: any) {
      console.log("err 4", error);
      return rejectWithValue(
        error.response?.data?.message || "Error fetching tournament"
      );
    }
  }
);

export const addTournament = createAsyncThunk(
  "tournaments/addTournament",
  async (tournament: any, { rejectWithValue }) => {
    try {
      if (Array.isArray(tournament?.timeLine)) {
        tournament.timeLine = tournament.timeLine.map((item: any) => {
          const newItem = { ...item };
          if (newItem.startDate) {
            newItem.startDate = moment(newItem.startDate)
              .tz("Asia/Riyadh")
              .format();
          }
          if (newItem.endDate) {
            newItem.endDate = moment(newItem.endDate)
              .tz("Asia/Riyadh")
              .format();
          }
          return newItem;
        });
      }
      if (tournament?.startDate) {
        tournament.startDate = moment(tournament.startDate)
          .tz("Asia/Riyadh")
          .format();
      }
      if (tournament?.endDate) {
        tournament.endDate = moment(tournament.endDate)
          .tz("Asia/Riyadh")
          .format();
      }

      const response = await axiosInstance.post("/Tournament", tournament, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error adding tournament"
      );
    }
  }
);

export const updateTournament = createAsyncThunk(
  "tournaments/updateTournament",
  async (
    { id, tournament }: { id: string; tournament: any },
    { rejectWithValue }
  ) => {
    try {
      if (Array.isArray(tournament?.timeLine)) {
        tournament.timeLine = tournament.timeLine.map((item: any) => {
          const newItem = { ...item };
          if (newItem.startDate) {
            newItem.startDate = moment(newItem.startDate)
              .tz("Asia/Riyadh")
              .format();
          }
          if (newItem.endDate) {
            newItem.endDate = moment(newItem.endDate)
              .tz("Asia/Riyadh")
              .format();
          }
          return newItem;
        });
      }
      if (tournament?.startDate) {
        tournament.startDate = moment(tournament.startDate)
          .tz("Asia/Riyadh")
          .format();
      }
      if (tournament?.endDate) {
        tournament.endDate = moment(tournament.endDate)
          .tz("Asia/Riyadh")
          .format();
      }
      const response = await axiosInstance.put(
        `/Tournament?id=${id}`,
        tournament,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating tournament"
      );
    }
  }
);

export const deleteTournament = createAsyncThunk(
  "tournaments/deleteTournament",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/Tournament?id=${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error deleting tournament"
      );
    }
  }
);

export const toggleTournament = createAsyncThunk(
  "tournaments/toggleTournament",
  async (
    { id, isActive }: { id: string; isActive: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(`/Tournament?id=${id}`, {
        isActive,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating tournament"
      );
    }
  }
);

export const fetchEligibleParticipants = createAsyncThunk(
  "tournaments/fetchEligibleParticipants",
  async (
    {
      tournamentId,
      page,
      perPage,
      searchTerm,
    }: {
      tournamentId: string;
      page: number;
      perPage: number;
      searchTerm: string | null;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(
        `/TournamentParticipants/eligible`,
        {
          params: {
            tournamentId,
            page,
            perPage,
            searchTerm: searchTerm || null, // Handle null searchTerm as in cURL
          },
        }
      );
  
      return response.data.data;
    } catch (error: any) {
      console.log("err fetch eligible participants", error);
      return rejectWithValue(
        error.response?.data?.message || "Error fetching eligible participants"
      );
    }
  }
);

const tournamentSlice = createSlice({
  name: "tournaments",
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
    setParticipantsPerPage: (state, action: PayloadAction<number>) => {
      state.participantsPerPage = action.payload;
      state.participantsCurrentPage = 1;
    },
    setParticipantsPage: (state, action: PayloadAction<number>) => {
      state.participantsCurrentPage = action.payload;
    },
    setMatchesPerPage: (state, action: PayloadAction<number>) => {
      state.matchesPerPage = action.payload;
      state.matchesCurrentPage = 1;
    },
    setMatchesPage: (state, action: PayloadAction<number>) => {
      state.matchesCurrentPage = action.payload;
    },
    setTicketsPerPage: (state, action: PayloadAction<number>) => {
      state.ticketsPerPage = action.payload;
      state.ticketsCurrentPage = 1;
    },
    setTicketsPage: (state, action: PayloadAction<number>) => {
      state.ticketsCurrentPage = action.payload;
    },
    setOperatorsPerPage: (state, action: PayloadAction<number>) => {
      state.operatorsPerPage = action.payload;
      state.operatorsCurrentPage = 1;
    },
    setOperatorsPage: (state, action: PayloadAction<number>) => {
      state.operatorsCurrentPage = action.payload;
    },
    setEligibleParticipantsSearchTerm: (
      state,
      action: PayloadAction<string>
    ) => {
      state.eligibleParticipantsSearchTerm = action.payload;
      state.eligibleParticipantsCurrentPage = 1;
    },
    setEligibleParticipantsPerPage: (state, action: PayloadAction<number>) => {
      state.eligibleParticipantsPerPage = action.payload;
      state.eligibleParticipantsCurrentPage = 1;
    },
    setEligibleParticipantsPage: (state, action: PayloadAction<number>) => {
      state.eligibleParticipantsCurrentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchTournaments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTournaments.fulfilled, (state, action) => {
        state.loading = false;
        state.tournaments = action.payload.data?.result;
        state.totalCount = action.payload.data.totalItem;
      })
      .addCase(fetchTournaments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTournamentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTournamentById.fulfilled, (state, action) => {
        state.loading = false;
        state.tournamentDetail = action.payload.data;
      })
      .addCase(fetchTournamentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(addTournament.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTournament.fulfilled, (state) => {
        state.loading = false;
        toast.success("Tournament added successfully!");
      })
      .addCase(addTournament.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to add tournament!");
      })
      .addCase(updateTournament.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTournament.fulfilled, (state) => {
        state.loading = false;
        toast.success("Tournament updated successfully!");
      })
      .addCase(updateTournament.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to update tournament!");
      })
      .addCase(deleteTournament.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTournament.fulfilled, (state) => {
        state.loading = false;
        toast.success("Tournament deleted successfully!");
      })
      .addCase(deleteTournament.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to delete tournament!");
      })
      .addCase(fetchEligibleParticipants.pending, (state) => {
        state.eligibleParticipantsLoading = true;
        state.eligibleParticipantsError = null;
      })
      .addCase(fetchEligibleParticipants.fulfilled, (state, action) => {
        state.eligibleParticipantsLoading = false;
        state.eligibleParticipants = action.payload.data?.result || [];
        state.eligibleParticipantsTotalCount =
          action.payload.data?.totalItem || 0;
      })
      .addCase(fetchEligibleParticipants.rejected, (state, action) => {
        state.eligibleParticipantsLoading = false;
        state.eligibleParticipantsError = action.payload as string;
        toast.error("Failed to fetch eligible participants!");
      });
  },
});

export const {
  setSearchTerm,
  setPerPage,
  setParticipantsPerPage,
  setMatchesPerPage,
  setPage,
  setParticipantsPage,
  setMatchesPage,
  setTicketsPerPage,
  setTicketsPage,
  setOperatorsPerPage,
  setOperatorsPage,
  setEligibleParticipantsSearchTerm,
  setEligibleParticipantsPerPage,
  setEligibleParticipantsPage,
} = tournamentSlice.actions;

export default tournamentSlice.reducer;
