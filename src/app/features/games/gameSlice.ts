import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GamesState } from "../../types";
import axiosInstance from "../../../axios";
import toast from "react-hot-toast";

const initialState: GamesState = {
  games: [],
  loading: false,
  error: null,
  currentPage: 1,
  perPage: 10,
  totalCount: 0,
  searchTerm: "",
};

export const fetchGames = createAsyncThunk(
  "games/fetchGames",
  async (
    {
      page,
      perPage,
      searchTerm,
    }: { page: number; perPage: number; searchTerm: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get("/game", {
        params: {
          page,
          limit: perPage,
          searchKey: searchTerm,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching partners"
      );
    }
  }
);

export const addGame = createAsyncThunk(
  "games/addGame",
  async (device: FormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/game", device, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error adding game"
      );
    }
  }
);

export const updateGame = createAsyncThunk(
  "games/updateGame",
  async (
    { id, device }: { id: string; device: FormData },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(`/game?id=${id}`, device, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error updateing game"
      );
    }
  }
);

export const deleteGame = createAsyncThunk(
  "games/deleteGame",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/game?id=${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error deleteing game"
      );
    }
  }
);

const gamesSlice = createSlice({
  name: "games",
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
      .addCase(fetchGames.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.loading = false;
        state.games = action.payload.data?.result;
        state.totalCount = action.payload.data.totalItem;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addGame.pending, (state) => {
        state.loading = true;
      })
      .addCase(addGame.fulfilled, (state) => {
        state.loading = false;
        // toast.success("Game added successfully!");
        toast.success("New game is created.");
      })
      .addCase(addGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(updateGame.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateGame.fulfilled, (state) => {
        state.loading = false;
        toast.success("Game updated successfully!");
      })
      .addCase(updateGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(deleteGame.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteGame.fulfilled, (state) => {
        state.loading = false;
        toast.success("Game deleted successfully!");
      })
      .addCase(deleteGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});

export const { setSearchTerm, setPerPage, setPage } = gamesSlice.actions;

export default gamesSlice.reducer;
