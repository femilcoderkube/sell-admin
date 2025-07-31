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
  teamMembers: Array<{ user: string; role: string }>;
  totalPages: number; // Added for pagination
  totalItem: number;
  joinTeamSuccess: boolean;
  leaveTeamSuccess: boolean;
}

const initialState: TeamState = {
  teams: [],
  loading: false,
  error: null,
  currentPage: 1,
  perPage: 10,
  totalCount: 0,
  searchTerm: "",
  joinTeamSuccess: false,
  leaveTeamSuccess: false,
  teamMembers: [],
  totalPages: 0, // Initialize pagination fields
  totalItem: 0,
};

interface TeamActionPayload {
  teamId: string;
  userId: string;
  role?: "Player" | "Coach" | "Manager" | "President";
}

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

export const fetchTeamMembers = createAsyncThunk(
  "teams/fetchTeamMembers",
  async (
    {
      teamId,
      page,
      perPage,
      searchTerm,
    }: { teamId: string; page: number; perPage: number; searchTerm: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(`/Team/members`, {
        params: {
          teamId,
          page,
          // limit: perPage,
          searchKey: searchTerm,
        },
      });
      return response.data;
    } catch (error: any) {
      console.log("err fetchTeamMembers", error);
      return rejectWithValue(
        error.response?.data?.message || "Error fetching team members"
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

export const joinTeam = createAsyncThunk(
  "teams/joinTeam",
  async (payload: TeamActionPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/Team/join", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: any) {
      console.log("err joinTeam", error);
      return rejectWithValue(
        error.response?.data?.message || "Error joining team"
      );
    }
  }
);

export const leaveTeam = createAsyncThunk(
  "teams/leaveTeam",
  async (payload: TeamActionPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/Team/leave", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: any) {
      console.log("err leaveTeam", error);
      return rejectWithValue(
        error.response?.data?.message || "Error leaving team"
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
    resetJoinTeamSuccess: (state) => {
      state.joinTeamSuccess = false;
    },
    resetLeaveTeamSuccess: (state) => {
      state.leaveTeamSuccess = false;
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
      .addCase(fetchTeamMembers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.teamMembers = action.payload.data?.members; // Assuming members are in data.result
        state.totalPages = action.payload.data.pagination.totalPages; // Update pagination
        state.totalItem = action.payload.data.pagination.totalItem; // Update pagination
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
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
      })
      .addCase(joinTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.joinTeamSuccess = false;
      })
      .addCase(joinTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.joinTeamSuccess = true;
        toast.success("Joined team successfully!");
      })
      .addCase(joinTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.joinTeamSuccess = false;
        toast.error(action.payload as string);
      })
      .addCase(leaveTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.leaveTeamSuccess = false;
      })
      .addCase(leaveTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveTeamSuccess = true;
        toast.success("Left team successfully!");
      })
      .addCase(leaveTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.leaveTeamSuccess = false;
        toast.error("Failed to leave team!");
      });
  },
});

export const {
  setSearchTerm,
  setPerPage,
  setPage,
  resetJoinTeamSuccess,
  resetLeaveTeamSuccess,
} = teamSlice.actions;

export default teamSlice.reducer;
