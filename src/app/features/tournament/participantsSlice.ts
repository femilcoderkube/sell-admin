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
      status,
    }: {
      tournamentId: string;
      page: number;
      perPage?: number;
      searchTerm: string | null;
      status?: string;
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
          status,
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
export const fetchParticipantsList = createAsyncThunk(
  "participants/fetchParticipantsList",
  async (
    {
      tournamentId,
      page,
      perPage,
      searchTerm,
      status,
      excelsheet,
    }: {
      tournamentId: string;
      page: number;
      perPage?: number;
      searchTerm: string | null;
      status: string;
      excelsheet: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(
        "/Team/complete-incomplete-teamsheet",
        {
          params: {
            tournamentId,
            page,
            limit: perPage,
            searchTerm: searchTerm || null,
            status,
            // excelsheet: excelsheet || false,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.log("err fetch participants", error);
      return rejectWithValue(
        error.response?.data?.message || "Error fetching participants"
      );
    }
  }
);

export const generateExcelFile = createAsyncThunk(
  "participants/generateExcelFile",
  async ({ tournamentId }: { tournamentId: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/Team/complete-incomplete-teamsheet?tournamentId=${tournamentId}&excelsheet=true`,

        {
          headers: {
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
          responseType: "blob",
        }
      );
      const blob = response.data;
      const contentDisposition = response.headers["content-disposition"];
      let filename = "participants_export.xlsx";
      if (contentDisposition) {
        const match = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (match && match[1]) {
          filename = match[1].replace(/['"]/g, "");
        }
      }
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
      let errorMessage = "Failed to export participants";

      if (err.response) {
        errorMessage =
          err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = "Network error: No response from server";
      } else {
        errorMessage = err.message || "Unknown error occurred";
      }

      return rejectWithValue(errorMessage);
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
      .addCase(fetchParticipantsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParticipantsList.fulfilled, (state, action) => {
        state.loading = false;
        state.participants = action.payload.data?.result || [];
        state.totalCount = action.payload.data?.totalItem || 0;
      })
      .addCase(fetchParticipantsList.rejected, (state, action) => {
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
      })
      .addCase(generateExcelFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateExcelFile.fulfilled, (state) => {
        state.loading = false;
        toast.success("Participants exported successfully!");
      })
      .addCase(generateExcelFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to export participants!");
      });
  },
});

export const { setSearchTerm, setPerPage, setPage } = participantsSlice.actions;

export default participantsSlice.reducer;
