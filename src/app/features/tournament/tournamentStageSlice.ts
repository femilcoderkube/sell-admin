import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../axios"; // Adjust path to your axios instance
import toast from "react-hot-toast";

// Interface for stage settings
interface StageSettings {
  numberOfGroups?: number;
  numberOfQualifiers?: number;
  isDoubleRoundRobin?: boolean;
  isThirdPlaceMatch?: boolean;
  lossesToBeEliminated?: number;
  killPoints?: number;
  placePoints?: number;
  tieBreaker?: string;
  htmlFile?: string;
  cssFile?: string;
}

// Interface for stage data
interface Stage {
  id: string;
  nameEn: string;
  nameAr: string;
  description: string;
}

// Interface for stage state
interface TournamentStageState {
  stages: Stage[];
  stagesList: any;
  stagesDetails: any;
  selectedStage: string | null;
  step: "select" | "form";
  loading: boolean;
  updateTournamentStageloading: boolean;
  error: string | null;
  currentPage: 1;
  perPage: 10;
  totalCount: 0;
}

// Initial state
const initialState: TournamentStageState = {
  stages: [
    // {
    //   id: "SingleElimination",
    //   nameEn: "Single Elimination",
    //   nameAr: "إقصاء واحد",
    //   description: "Single-elimination bracket with optional third-place match",
    // },
    {
      id: "DoubleElimination",
      nameEn: "Double Elimination",
      nameAr: "إقصاء مزدوج",
      description: "Teams get a second chance with winner and loser brackets",
    },
    {
      id: "RoundRobin",
      nameEn: "Round Robin",
      nameAr: "دوري",
      description: "All participants compete against each other in groups",
    },
    // {
    //   id: "Swiss",
    //   nameEn: "Swiss Stage",
    //   nameAr: "مرحلة سويسرية",
    //   description: "Participants with similar scores face each other",
    // },
    {
      id: "BattleRoyal",
      nameEn: "Battle Royal",
      nameAr: "معركة ملكية",
      description:
        "All participants compete simultaneously until qualifiers remain",
    },
    // {
    //   id: "Custom",
    //   nameEn: "Custom Stage",
    //   nameAr: "مرحلة مخصصة",
    //   description: "Custom stage with user-defined HTML and CSS",
    // },
  ],
  selectedStage: null,
  stagesList: [],
  stagesDetails: null,
  step: "select",
  loading: false,
  updateTournamentStageloading: false,
  error: null,
  currentPage: 1,
  perPage: 10,
  totalCount: 0,
};

export const getTournamentStages = createAsyncThunk(
  "tournamentStage/getTournamentStages",
  async (
    payload: { tournamentId?: string; id?: string },
    { rejectWithValue }
  ) => {
    try {
      // Construct query string dynamically
      const queryParams = [];
      if (payload.tournamentId) {
        queryParams.push(`tournamentId=${payload.tournamentId}`);
      }
      if (payload.id) {
        queryParams.push(`id=${payload.id}`);
      }
      const queryString =
        queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
      const url = `/TournamentStage${queryString}`;

      const response = await axiosInstance.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error: any) {
      console.log("err fetch tournament stages", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch stages"
      );
    }
  }
);
export const getTournamentStagesById = createAsyncThunk(
  "tournamentStage/getTournamentStagesById",
  async (
    payload: { tournamentId?: string; id?: string },
    { rejectWithValue }
  ) => {
    try {
      // Construct query string dynamically
      const queryParams = [];
      if (payload.tournamentId) {
        queryParams.push(`tournamentId=${payload.tournamentId}`);
      }
      if (payload.id) {
        queryParams.push(`id=${payload.id}`);
      }
      const queryString =
        queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
      const url = `/TournamentStage${queryString}`;

      const response = await axiosInstance.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error: any) {
      console.log("err fetch tournament stages", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch stages"
      );
    }
  }
);

export const getSeeds = createAsyncThunk(
  "tournamentStage/getSeeds",
  async (
    { id, tournamentId }: { id: string; tournamentId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(
        `/TournamentStage/seeds?id=${id}&tournamentId=${tournamentId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch seeds"
      );
    }
  }
);

// Async thunk for deleting a stage
export const deleteTournamentStage = createAsyncThunk(
  "tournamentStage/deleteTournamentStage",
  async (stageId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/TournamentStage?id=${stageId}`);
      return stageId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete stage"
      );
    }
  }
);

// Async thunk for creating a stage
export const createTournamentStage = createAsyncThunk(
  "tournamentStage/createTournamentStage",
  async (
    stageData: {
      tournament: string;
      stageType: string;
      stageName: string;
      stageNameAr?: string;
      numberOfParticipants: number;
      settings: StageSettings;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/TournamentStage", stageData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create stage"
      );
    }
  }
);

export const updateTournamentStage = createAsyncThunk(
  "tournamentStage/updateTournamentStage",
  async (
    {
      stageId,
      ...stageData
    }: {
      stageId?: string;
      tournament?: string;
      stageType?: string;
      stageName?: string;
      stageNameAr?: string;
      numberOfParticipants?: number;
      settings?: StageSettings;
      seed?: any;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(
        `/TournamentStage?id=${stageId}`,
        stageData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update stage"
      );
    }
  }
);

const tournamentStageSlice = createSlice({
  name: "tournamentStage",
  initialState,
  reducers: {
    resetStages: (state) => {
      state.stagesList = [];
      state.error = null;
    },
    clearStageData: (state) => {
      state.selectedStage = null;
      state.step = "select";
      state.error = null;
    },
    setSelectedStage: (state, action) => {
      state.selectedStage = action.payload;
      state.step = "form";
    },
    setStep: (state, action) => {
      state.step = action.payload;
      if (action.payload === "select") {
        state.selectedStage = null;
      }
    },

    setPerPage: (state, action) => {
      state.perPage = action.payload;
      state.currentPage = 1;
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTournamentStages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTournamentStages.fulfilled, (state, action) => {
        state.loading = false;
        state.stagesList = action.payload.data.result
          ? action.payload.data.result
          : action.payload.data;
        state.totalCount = action.payload.data.totalItem;
      })
      .addCase(getTournamentStages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(getTournamentStagesById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTournamentStagesById.fulfilled, (state, action) => {
        state.loading = false;
        state.stagesDetails = action.payload.data.result
          ? action.payload.data.result
          : action.payload.data;
        state.totalCount = action.payload.data.totalItem;
      })
      .addCase(getTournamentStagesById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(createTournamentStage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTournamentStage.fulfilled, (state, action) => {
        state.loading = false;
        state.step = "select";
        state.selectedStage = null;
        toast.success("Stage has been created successfully.");
      })
      .addCase(createTournamentStage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(deleteTournamentStage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTournamentStage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        toast.success("Stage has been deleted successfully.");
      })
      .addCase(deleteTournamentStage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(updateTournamentStage.pending, (state) => {
        state.updateTournamentStageloading = true;
        state.error = null;
      })
      .addCase(updateTournamentStage.fulfilled, (state, action) => {
        state.updateTournamentStageloading = false;
        state.error = null;
        toast.success("Stage has been updated successfully.");
      })
      .addCase(updateTournamentStage.rejected, (state, action) => {
        state.updateTournamentStageloading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(getSeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSeeds.fulfilled, (state, action) => {
        state.loading = false;
        // Assuming the response contains seeds data, store it in the state
        // state.stagesList = action.payload.data; // Adjust based on your API response structure
      })
      .addCase(getSeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});

export const {
  resetStages,
  clearStageData,
  setSelectedStage,
  setStep,
  setPerPage,
  setPage,
} = tournamentStageSlice.actions;
export default tournamentStageSlice.reducer;
