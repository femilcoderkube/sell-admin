import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../../axios";
import toast from "react-hot-toast";

interface Popup {
  id?: string;
  title: string;
  description: string;
  expireDateTime: string;
  status: string;
}

interface PopupState {
  popups: Popup[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  perPage: number;
  totalCount: number;
  searchTerm: string;
  popupDetail: Popup | null;
}

const initialState: PopupState = {
  popups: [],
  loading: false,
  error: null,
  currentPage: 1,
  perPage: 10,
  searchTerm: "",
  popupDetail: null,
};

export const fetchPopups = createAsyncThunk(
  "popups/fetchPopups",
  async (
    {
      page,
      perPage,
      searchTerm,
    }: { page: number; perPage: number; searchTerm: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get("/Popup", {
        params: {
          page,
          limit: perPage,
          searchKey: searchTerm,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching popups"
      );
    }
  }
);

export const fetchPopupById = createAsyncThunk(
  "popups/fetchPopupById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/Popup?id=${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching popup"
      );
    }
  }
);

export const addPopup = createAsyncThunk(
  "popups/addPopup",
  async (popup: Popup, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/Popup/create", popup);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error adding popup"
      );
    }
  }
);

export const updatePopup = createAsyncThunk(
  "popups/updatePopup",
  async ({ id, popup }: { id: string; popup: Popup }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/Popup?id=${id}`, popup);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating popup"
      );
    }
  }
);

export const deletePopup = createAsyncThunk(
  "popups/deletePopup",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/Popup?id=${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error deleting popup"
      );
    }
  }
);

const popupsSlice = createSlice({
  name: "popups",
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
      .addCase(fetchPopups.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPopups.fulfilled, (state, action) => {
        state.loading = false;
        state.popups = action.payload.data?.result;
        state.totalCount = action.payload.data.totalItem;
      })
      .addCase(fetchPopups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPopupById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPopupById.fulfilled, (state, action) => {
        state.loading = false;
        state.popupDetail = action.payload.data;
      })
      .addCase(fetchPopupById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addPopup.pending, (state) => {
        state.loading = true;
      })
      .addCase(addPopup.fulfilled, (state) => {
        state.loading = false;
        toast.success("Popup added successfully!");
      })
      .addCase(addPopup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to add popup!");
      })
      .addCase(updatePopup.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePopup.fulfilled, (state) => {
        state.loading = false;
        toast.success("Popup updated successfully!");
      })
      .addCase(updatePopup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to update popup!");
      })
      .addCase(deletePopup.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePopup.fulfilled, (state) => {
        state.loading = false;
        toast.success("Popup deleted successfully!");
      })
      .addCase(deletePopup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});

export const { setSearchTerm, setPerPage, setPage } = popupsSlice.actions;

export default popupsSlice.reducer;
