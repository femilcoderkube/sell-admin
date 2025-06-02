import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { rulesState } from "../../types";
import axiosInstance from "../../../axios";
import toast from "react-hot-toast";

const initialState: any = {
  rules: [],
  loading: false,
  error: null,
  currentPage: 1,
  perPage: 10,
  totalCount: 0,
  searchTerm: "",
  rulesDetail: null,
};

export const fetchRules = createAsyncThunk(
  "rules/fetchRules",
  async (
    {
      page,
      perPage,
      searchTerm,
    }: { page: number; perPage: number; searchTerm: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get("/rules", {
        params: {
          page,
          limit: perPage,
          searchKey: searchTerm,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching rules"
      );
    }
  }
);

export const fetchRulesById = createAsyncThunk(
  "rules/fetchRulesById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/rules?id=${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching rules"
      );
    }
  }
);

export const addRules = createAsyncThunk(
  "rules/addRules",
  async (rule: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/rules", rule, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error adding rule"
      );
    }
  }
);

export const updateRules = createAsyncThunk(
  "rules/updateRules",
  async ({ id, rule }: { id: string; rule: any }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/rules?id=${id}`, rule, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating rule"
      );
    }
  }
);

export const deleteRules = createAsyncThunk(
  "rules/deleteRules",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/rules?id=${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error adding device"
      );
    }
  }
);

const rulesSlice = createSlice({
  name: "rules",
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
      .addCase(fetchRules.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRules.fulfilled, (state, action) => {
        state.loading = false;
        state.rules = action.payload.data?.result;
        state.totalCount = action.payload.data.totalItem;
      })
      .addCase(fetchRules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchRulesById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRulesById.fulfilled, (state, action) => {
        state.loading = false;
        state.ruleDetail = action.payload.data;
      })
      .addCase(fetchRulesById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addRules.pending, (state) => {
        state.loading = true;
      })
      .addCase(addRules.fulfilled, (state) => {
        state.loading = false;
        toast.success("Rule added succesfully!");
      })
      .addCase(addRules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to add rule!");
      })
      .addCase(updateRules.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateRules.fulfilled, (state) => {
        state.loading = false;
        toast.success("Rule updated succesfully!");
      })
      .addCase(updateRules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to update rule!");
      });
  },
});

export const { setSearchTerm, setPerPage, setPage } = rulesSlice.actions;

export default rulesSlice.reducer;
