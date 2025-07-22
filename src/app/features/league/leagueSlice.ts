import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LeagueState, League, AssignLeaguePayload } from "../../types";
import axiosInstance from "../../../axios";
import toast from "react-hot-toast";
import moment from "moment-timezone";

const initialState: LeagueState = {
  leagues: [],
  loading: false,
  error: null,
  currentPage: 1,
  perPage: 10,
  totalCount: 0,
  searchTerm: "",
  leagueDetail: null,
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
};

export const fetchLeagueMatches = createAsyncThunk(
  "leagues/fetchLeagueMatches",
  async (
    {
      leagueId,
      page,
      matchesPerPage,
      searchKey,
      status,
    }: {
      leagueId: string;
      page: number;
      matchesPerPage: number;
      searchKey?: string;
      status?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();

      params.append("leagueId", leagueId);
      params.append("page", String(page));
      params.append("limit", String(matchesPerPage));

      if (searchKey && searchKey.trim() !== "") {
        params.append("searchKey", searchKey);
      }

      if (status && status !== "all") {
        params.append("status", status);
      }

      const response = await axiosInstance.get(
        `/LeagueMatch?${params.toString()}`
      );
      return response.data;
    } catch (error: any) {
      console.log("err", error);
      return rejectWithValue(
        error.response?.data?.message || "Error fetching league matches"
      );
    }
  }
);

export const fetchLeagueMatchesByID = createAsyncThunk(
  "leagues/fetchLeagueMatchesByID",
  async ({ matcheId }: { matcheId: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/LeagueMatch?id=${matcheId}`);
      return response.data;
    } catch (error: any) {
      console.log("err 1", error);

      return rejectWithValue(
        error.response?.data?.message || "Error fetching league matches"
      );
    }
  }
);
export const updateLeagueMatchesByID = createAsyncThunk(
  "leagues/updateLeagueMatchesByID", // Updated action type for clarity
  async (
    {
      matcheId,
      matchScores,
      status,
      winner,
    }: {
      matcheId: string;
      matchScores?: any;
      status?: string;
      winner?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(`/LeagueMatch?id=${matcheId}`, {
        matchScores,
        ...(status && { status }),
        winner,
        // ...(winner && { winner }),
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating league match"
      );
    }
  }
);

export const fetchLeagueParticipants = createAsyncThunk(
  "leagues/fetchLeagueParticipants",
  async (
    {
      leagueId,
      page,
      participantsPerPage,
      searchKey,
    }: {
      leagueId: string;
      page: number;
      participantsPerPage: number;
      searchKey?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();

      params.append("leagueId", leagueId);
      params.append("page", String(page));
      params.append("limit", String(participantsPerPage));
      console.log("searchKey", searchKey);
      if (searchKey && searchKey.trim() !== "") {
        params.append("searchKey", searchKey);
      }

      const response = await axiosInstance.get(
        `/LeaguesParticipants?${params.toString()}`
      );
      return response.data;
    } catch (error: any) {
      console.log("err 2", error);

      return rejectWithValue(
        error.response?.data?.message || "Error fetching league participants"
      );
    }
  }
);

export const fetchLeagueTickets = createAsyncThunk(
  "leagues/fetchLeagueTickets",
  async (
    {
      leagueId,
      page,
      ticketsPerPage,
      status,
    }: {
      leagueId: string;
      page: number;
      ticketsPerPage: number;
      status: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(
        `/LeaguesTickets?leagueId=${leagueId}&page=${page}&limit=${ticketsPerPage}&status=${status}`
      );
      return response.data;
    } catch (error: any) {
      console.log("err 2", error);

      return rejectWithValue(
        error.response?.data?.message || "Error fetching league tickets"
      );
    }
  }
);

export const fetchLeagues = createAsyncThunk(
  "leagues/fetchLeagues",
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
      const response = await axiosInstance.get("/leagues", {
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
        error.response?.data?.message || "Error fetching leagues"
      );
    }
  }
);

export const fetchLeagueById = createAsyncThunk(
  "leagues/fetchLeagueById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/leagues?id=${id}`);
      return response.data;
    } catch (error: any) {
      console.log("err 4", error);

      return rejectWithValue(
        error.response?.data?.message || "Error fetching league"
      );
    }
  }
);

export const addLeague = createAsyncThunk(
  "leagues/addLeague",
  async (league: any, { rejectWithValue }) => {
    try {
      if (Array.isArray(league?.timeLine)) {
        league.timeLine = league.timeLine.map((item: any) => {
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
      if (league?.startDate) {
        league.startDate = moment(league.startDate).tz("Asia/Riyadh").format();
      }
      if (league?.endDate) {
        league.endDate = moment(league.endDate).tz("Asia/Riyadh").format();
      }

      const response = await axiosInstance.post("/Leagues", league, {
        headers: {
          // "Content-Type": "multipart/form-data",
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error adding league"
      );
    }
  }
);

export const updateLeague = createAsyncThunk(
  "leagues/updateLeague",
  async (
    { id, league }: { id: string; league: FormData },
    { rejectWithValue }
  ) => {
    try {
      if (Array.isArray(league?.timeLine)) {
        league.timeLine = league.timeLine.map((item: any) => {
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
      if (league?.startDate) {
        league.startDate = moment(league.startDate).tz("Asia/Riyadh").format();
      }
      if (league?.endDate) {
        league.endDate = moment(league.endDate).tz("Asia/Riyadh").format();
      }
      const response = await axiosInstance.put(`/Leagues?id=${id}`, league, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating league"
      );
    }
  }
);

export const toogleleague = createAsyncThunk(
  "leagues/toogleleague",
  async (
    { id, isHidden }: { id: string; isHidden: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(`/Leagues?id=${id}`, {
        isHidden,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating league"
      );
    }
  }
);

export const addLeagueMatchScore = createAsyncThunk(
  "leagues/addLeagueMatchScore",
  async (
    {
      matcheId,
      yourScore,
      opponentScore,
    }: { matcheId: string; yourScore: number; opponentScore: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(
        `/LeagueMatch/addscore?id=${matcheId}`,
        {
          yourScore,
          opponentScore,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.log("err addScore", error);
      return rejectWithValue(
        error.response?.data?.message || "Error adding match scores"
      );
    }
  }
);

export const deleteLeague = createAsyncThunk(
  "leagues/deleteLeague",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/leagues?id=${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error deleting league"
      );
    }
  }
);

export const registerForLeague = createAsyncThunk(
  "leagues/registerForLeague",
  async (
    registration: {
      leagueId: string;
      userId: string;
      username: string;
      gameID: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/Participant", registration, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error registering for league"
      );
    }
  }
);

export const adoptLeagueMatchScore = createAsyncThunk(
  "leagues/adoptLeagueMatchScore",
  async (
    { matcheId, index }: { matcheId: string; index: number },
    { rejectWithValue }
  ) => {
    console.log("matcheId", matcheId);
    try {
      const response = await axiosInstance.put(
        `/LeagueMatch/adoptscore?id=${matcheId}`,
        { index },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.log("err adoptScore", error);
      return rejectWithValue(
        error.response?.data?.message || "Error adopting match score"
      );
    }
  }
);

export const generateExcelFile = createAsyncThunk(
  "leagues/generateExcelFile", // Fixed typo and more descriptive name
  async ({ lid }: { lid: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `LeaguesParticipants/export/excel?leagueId=${lid}`,
        {
          headers: {
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
          responseType: "blob", // This is crucial for file downloads
        }
      );

      // Response is already a blob due to responseType: 'blob'
      const blob = response.data;

      // Get filename from response headers or use a default
      const contentDisposition = response.headers["content-disposition"];
      let filename = "participants_export.xlsx"; // Changed to .xlsx for Excel files

      if (contentDisposition) {
        const match = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (match && match[1]) {
          filename = match[1].replace(/['"]/g, "");
        }
      }

      // Create a link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      return {
        success: true,
        message: "Excel file downloaded successfully",
        filename,
      };
    } catch (err: any) {
      console.error("Excel export error:", err);

      // Better error handling
      let errorMessage = "Failed to export participants";

      if (err.response) {
        // Server responded with error status
        errorMessage =
          err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = "Network error: No response from server";
      } else {
        // Something else happened
        errorMessage = err.message || "Unknown error occurred";
      }

      return rejectWithValue(errorMessage);
    }
  }
);

export const updateParticipants = createAsyncThunk(
  "participants/updateParticipants",
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/LeaguesParticipants?id=${id}`,
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating Participants"
      );
    }
  }
);

export const fetchOperatorList = createAsyncThunk(
  "leagues/fetchOperatorList",
  async (
    {
      id,
      page,
      perPage,
      searchKey,
    }: { id: string; page: number; perPage: number; searchKey?: string },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      params.append("id", id);
      params.append("page", String(page));
      params.append("limit", String(perPage));
      if (searchKey && searchKey.trim() !== "") {
        params.append("searchKey", searchKey);
      }
      const response = await axiosInstance.get(
        `/admin/operatorlist?${params.toString()}`
      );
      return response.data;
    } catch (error: any) {
      console.log("err operator list", error);
      return rejectWithValue(
        error.response?.data?.message || "Error fetching operator list"
      );
    }
  }
);

export const assignLeague = createAsyncThunk(
  "leagues/assignLeague",
  async (
    { operatorIds, leagueId }: AssignLeaguePayload,
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/assignLeague", {
        operatorIds,
        leagueId,
      });

      return response.data;
    } catch (error: any) {
      console.log("err 4", error);

      return rejectWithValue(
        error.response?.data?.message || "Error assigning league"
      );
    }
  }
);

const leagueSlice = createSlice({
  name: "leagues",
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
    setParticipantsPerPage: (state, action) => {
      state.participantsPerPage = action.payload;
      state.participantsCurrentPage = 1;
    },
    setParticipantsPage: (state, action: PayloadAction<number>) => {
      state.participantsCurrentPage = action.payload;
    },
    setMatchesperPage: (state, action) => {
      state.matchesPerPage = action.payload;
      state.matchesCurrentPage = 1;
    },
    setMatchesPage: (state, action: PayloadAction<number>) => {
      state.matchesCurrentPage = action.payload;
    },
    setTicketsPerPage: (state, action) => {
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeagueMatches.pending, (state) => {
        state.matchesLoading = true;
      })
      .addCase(fetchLeagueMatches.fulfilled, (state, action) => {
        state.matchesLoading = false;
        state.matches = action.payload.data.result;
        state.matchesTotalCount = action.payload.data.totalItem;
      })
      .addCase(fetchLeagueMatches.rejected, (state, action) => {
        state.matchesLoading = false;
        state.matchesError = action.payload as string;
      })

      .addCase(fetchLeagueTickets.pending, (state) => {
        state.ticketsLoading = true;
      })
      .addCase(fetchLeagueTickets.fulfilled, (state, action) => {
        state.ticketsLoading = false;
        state.tickets = action.payload.data;
        state.ticketsTotalCount = action.payload.data.totalItem;
      })
      .addCase(fetchLeagueTickets.rejected, (state, action) => {
        state.ticketsLoading = false;
        state.ticketsError = action.payload as string;
      })
      .addCase(fetchLeagueParticipants.pending, (state) => {
        state.participantsLoading = true;
      })
      .addCase(fetchLeagueParticipants.fulfilled, (state, action) => {
        state.participantsLoading = false;
        state.participants = action.payload.data.result;
        state.participantsTotalCount = action.payload.data.totalItem;
      })
      .addCase(fetchLeagueParticipants.rejected, (state, action) => {
        state.participantsLoading = false;
        state.participantsError = action.payload as string;
      })
      // ... other extraReducers remain unchanged
      .addCase(fetchLeagues.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeagues.fulfilled, (state, action) => {
        state.loading = false;
        state.leagues = action.payload.data?.result;
        state.totalCount = action.payload.data.totalItem;
      })
      .addCase(fetchLeagues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchLeagueById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeagueById.fulfilled, (state, action) => {
        state.loading = false;
        state.leagueDetail = action.payload.data;
      })
      .addCase(fetchLeagueById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchLeagueMatchesByID.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeagueMatchesByID.fulfilled, (state, action) => {
        state.loading = false;
        state.matcheDetail = action.payload.data;
      })
      .addCase(fetchLeagueMatchesByID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addLeague.pending, (state) => {
        state.loading = true;
      })
      .addCase(addLeague.fulfilled, (state) => {
        state.loading = false;
        toast.success("League added successfully!");
      })
      .addCase(addLeague.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to add league!");
      })
      .addCase(updateLeague.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateLeague.fulfilled, (state) => {
        state.loading = false;
        toast.success("League updated successfully!");
      })
      .addCase(updateLeague.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to update league!");
      })
      .addCase(deleteLeague.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteLeague.fulfilled, (state) => {
        state.loading = false;
        toast.success("League deleted successfully!");
      })
      .addCase(deleteLeague.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to delete league!");
      })
      .addCase(adoptLeagueMatchScore.pending, (state) => {
        state.loading = true;
      })
      .addCase(adoptLeagueMatchScore.fulfilled, (state) => {
        state.loading = false;
        toast.success("Accept score successfully!");
      })
      .addCase(adoptLeagueMatchScore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to Accept Score!");
      })
      .addCase(registerForLeague.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerForLeague.fulfilled, (state) => {
        state.loading = false;
        toast.success("Registered for league successfully!");
      })
      .addCase(registerForLeague.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to register for league!");
      })
      .addCase(updateLeagueMatchesByID.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateLeagueMatchesByID.fulfilled, (state, action) => {
        state.loading = false;
        state.matcheDetail = action.payload.data;
        // Optionally update matches array if needed
        state.matches = state.matches.map((match) =>
          match.id === action.payload.data.id ? action.payload.data : match
        );
        toast.success("Match updated successfully!");
      })
      .addCase(updateLeagueMatchesByID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to update match!");
      })
      .addCase(addLeagueMatchScore.pending, (state) => {
        state.loading = true;
      })
      .addCase(addLeagueMatchScore.fulfilled, (state, action) => {
        state.loading = false;
        // Update matcheDetail if it matches the updated match
        if (state.matcheDetail?.id === action.payload.data.id) {
          state.matcheDetail = action.payload.data;
        }
        // Update matches array to reflect the new scores
        state.matches = state.matches.map((match) =>
          match.id === action.payload.data.id ? action.payload.data : match
        );
        toast.success("Match scores added successfully!");
      })
      .addCase(addLeagueMatchScore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to add match scores!");
      })
      .addCase(fetchOperatorList.pending, (state) => {
        state.operatorsLoading = true;
      })
      .addCase(fetchOperatorList.fulfilled, (state, action) => {
        state.operatorsLoading = false;
        state.operators = action.payload.data.result;
        state.operatorsTotalCount = action.payload.data.totalItem;
        state.operatorDetail = action.payload.data; // Maintain backward compatibility
      })
      .addCase(fetchOperatorList.rejected, (state, action) => {
        state.operatorsLoading = false;
        state.operatorsError = action.payload as string;
      });
  },
});

export const {
  setSearchTerm,
  setPerPage,
  setParticipantsPerPage,
  setMatchesperPage,
  setPage,
  setParticipantsPage,
  setMatchesPage,
  setTicketsPerPage,
  setTicketsPage,
  setOperatorsPerPage,
  setOperatorsPage,
} = leagueSlice.actions;

export default leagueSlice.reducer;
