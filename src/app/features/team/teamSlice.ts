import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../../axios";
import toast from "react-hot-toast";

interface Team {
  _id?: string;
  teamName: string;
  teamShortName: string;
  region: string;
  members: Array<{ user: string; role: string }>;
  social: {
    facebookId?: string;
    youtubeChannelId?: string;
    discordId?: string;
    twitchId?: string;
    twitterId?: string;
  };
  logoImage?: string;
  backgroundImage?: string;
}

interface TeamState {
  teams: Team[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  perPage: number;
  totalCount: number;
  searchTerm: string;
  teamDetail: Team | null;
}

const initialState: TeamState = {
  teams: [],
  loading: false,
  error: null,
  currentPage: 1,
  perPage: 10,
  totalCount: 0,
  searchTerm: "",
  teamDetail: null,
};

export const fetchTeams = createAsyncThunk(
  "teams/fetchTeams",
  async (
    {
      page,
      perPage,
      searchTerm,
    }: { page: number; perPage: number; searchTerm: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get("/Team", {
        params: {
          page,
          limit: perPage,
          searchKey: searchTerm,
        },
      });
      return response.data;
    } catch (error: any) {
      console.log("err fetchTeams", error);
      return rejectWithValue(
        error.response?.data?.message || "Error fetching teams"
      );
    }
  }
);

export const fetchTeamById = createAsyncThunk(
  "teams/fetchTeamById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/Team?id=${id}`);
      return response.data;
    } catch (error: any) {
      console.log("err fetchTeamById", error);
      return rejectWithValue(
        error.response?.data?.message || "Error fetching team"
      );
    }
  }
);

export const addTeam = createAsyncThunk(
  "teams/addTeam",
  async (team: Team, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/Team", team, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: any) {
      console.log("err addTeam", error);
      return rejectWithValue(
        error.response?.data?.message || "Error adding team"
      );
    }
  }
);

export const updateTeam = createAsyncThunk(
  "teams/updateTeam",
  async ({ id, team }: { id: string; team: Team }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/Team?id=${id}`, team, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: any) {
      console.log("err updateTeam", error);
      return rejectWithValue(
        error.response?.data?.message || "Error updating team"
      );
    }
  }
);

export const deleteTeam = createAsyncThunk(
  "teams/deleteTeam",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/Team?id=${id}`);
      return response.data;
    } catch (error: any) {
      console.log("err deleteTeam", error);
      return rejectWithValue(
        error.response?.data?.message || "Error deleting team"
      );
    }
  }
);

const teamSlice = createSlice({
  name: "teams",
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
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload.data?.result;
        state.totalCount = action.payload.data.totalItem;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTeamById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeamById.fulfilled, (state, action) => {
        state.loading = false;
        state.teamDetail = action.payload.data;
      })
      .addCase(fetchTeamById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addTeam.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTeam.fulfilled, (state) => {
        state.loading = false;
        toast.success("Team added successfully!");
      })
      .addCase(addTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to add team!");
      })
      .addCase(updateTeam.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTeam.fulfilled, (state) => {
        state.loading = false;
        toast.success("Team updated successfully!");
      })
      .addCase(updateTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to update team!");
      })
      .addCase(deleteTeam.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTeam.fulfilled, (state) => {
        state.loading = false;
        toast.success("Team deleted successfully!");
      })
      .addCase(deleteTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to delete team!");
      });
  },
});

export const { setSearchTerm, setPerPage, setPage } = teamSlice.actions;

export default teamSlice.reducer;
