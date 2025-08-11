import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../../axios";
import toast from "react-hot-toast";

interface BannedUser {
  id: string;
  playerName: string;
  ipAddress: string;
  banDate: string;
  permanentBan: boolean;
  comment: string;
}

interface BannedUsersState {
  bannedUsers: BannedUser[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  perPage: number;
  totalCount: number;
  searchTerm: string;
}

const initialState: BannedUsersState = {
  bannedUsers: [],
  loading: false,
  error: null,
  currentPage: 1,
  perPage: 10,
  totalCount: 0,
  searchTerm: "",
};

export const fetchBannedUsers = createAsyncThunk(
  "bannedUsers/fetchBannedUsers",
  async (
    {
      page,
      perPage,
      searchTerm,
      status,
    }: { page: number; perPage: number; searchTerm: string; status?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get("/BannedUsers", {
        params: {
          page,
          limit: perPage,
          searchKey: searchTerm,
          ...(status && { status }),
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching banned users"
      );
    }
  }
);

export const createBannedUser = createAsyncThunk(
  "bannedUsers/createBannedUser",
  async (
    userData: {
      username: string;
      Date: string;
      ipAddress: string;
      isPermanent: boolean;
      comment: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/BannedUsers", userData);
      return response.data.data; // Assuming the API returns the created user in response.data.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error creating banned user"
      );
    }
  }
);

export const deleteBannedUser = createAsyncThunk(
  "bannedUsers/deleteBannedUser",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/BannedUsers?id=${id}`);
      return { id }; // Return the ID for state update
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error deleting banned user"
      );
    }
  }
);

const bannedUsersSlice = createSlice({
  name: "bannedUsers",
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
      // Fetch Banned Users
      .addCase(fetchBannedUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBannedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.bannedUsers = action.payload.data?.result || [];
        state.totalCount = action.payload.data?.totalItem || 0;
      })
      .addCase(fetchBannedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      // Create Banned User
      .addCase(createBannedUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBannedUser.fulfilled, (state, action) => {
        state.loading = false;
        state.bannedUsers.push(action.payload); // Add the new banned user to the list
        state.totalCount += 1;
        toast.success("Banned user created successfully.");
      })
      .addCase(createBannedUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      // Delete Banned User
      .addCase(deleteBannedUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBannedUser.fulfilled, (state, action) => {
        state.loading = false;
        state.bannedUsers = state.bannedUsers.filter(
          (user) => user.id !== action.payload.id
        );
        state.totalCount -= 1;
        toast.success("Banned user removed successfully.");
      })
      .addCase(deleteBannedUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});

export const { setSearchTerm, setPerPage, setPage } = bannedUsersSlice.actions;

export default bannedUsersSlice.reducer;
