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
  selectedStage: string | null;
  step: "select" | "form";
  loading: boolean;
  error: string | null;
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
    // {
    //   id: "RoundRobin",
    //   nameEn: "Round Robin",
    //   nameAr: "دوري",
    //   description: "All participants compete against each other in groups",
    // },
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
  step: "select",
  loading: false,
  error: null,
};

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
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create stage"
      );
    }
  }
);

const tournamentStageSlice = createSlice({
  name: "tournamentStage",
  initialState,
  reducers: {
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
  },
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export const { clearStageData, setSelectedStage, setStep } =
  tournamentStageSlice.actions;
export default tournamentStageSlice.reducer;
