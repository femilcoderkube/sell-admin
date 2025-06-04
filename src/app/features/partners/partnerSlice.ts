import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PartnersState } from "../../types";
import axiosInstance from "../../../axios";
import toast from "react-hot-toast";


const initialState: PartnersState = {
    partners: [],
    loading: false,
    error: null,
    currentPage: 1,
    perPage: 10,
    totalCount: 0,
    searchTerm: '',
    partnerDetail: null
  };

  export const fetchPartners = createAsyncThunk(
    'partners/fetchPartners',
    async (
      { page, perPage, searchTerm }: { page: number; perPage: number; searchTerm: string },
      { rejectWithValue }
    ) => {
      try {
        const response = await axiosInstance.get('/partners', {
          params: {
            page,
            limit: perPage,
            searchKey: searchTerm,
          },
        });
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Error fetching partners');
      }
    }
  );

  export const fetchPartnerById = createAsyncThunk(
    'partners/fetchPartnerById',
    async (id: string, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(`/partners?id=${id}`);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Error fetching partners');
      }
    }
  );

  export const addPartner = createAsyncThunk(
    "partners/addPartner",
    async (partner: FormData, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post("/partners", partner, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message || "Error adding partner"
        );
      }
    }
  );

  export const updatePartner = createAsyncThunk(
    "partners/updatePartner",
    async (
      { id, partner }: { id: string; partner: FormData },
      { rejectWithValue }
    ) => {
      try {
        const response = await axiosInstance.put(`/partners?id=${id}`, partner, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message || "Error updating partner"
        );
      }
    }
  );

  export const deletePartner = createAsyncThunk(
    "partners/deletePartner",
    async (id: string, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.delete(`/partners?id=${id}`);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message || "Error adding device"
        );
      }
    }
  );

  const partnersSlice = createSlice({
    name: 'partners',
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
        .addCase(fetchPartners.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchPartners.fulfilled, (state, action) => {
          state.loading = false;
          state.partners = action.payload.data?.result;
          state.totalCount = action.payload.data.totalItem;
        })
        .addCase(fetchPartners.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })
        .addCase(fetchPartnerById.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchPartnerById.fulfilled, (state, action) => {
          state.loading = false;
          state.partnerDetail = action.payload.data;
        })
        .addCase(fetchPartnerById.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })
        .addCase(addPartner.pending, (state) => {
          state.loading = true;
        })
        .addCase(addPartner.fulfilled, (state) => {
          state.loading = false;
          toast.success('Partner added succesfully!');
        })
        .addCase(addPartner.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
          toast.error('Failed to add partner!');
        })
        .addCase(updatePartner.pending, (state) => {
          state.loading = true;
        })
        .addCase(updatePartner.fulfilled, (state) => {
          state.loading = false;
          toast.success('Partner updated succesfully!');
        })
        .addCase(updatePartner.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
          toast.error('Failed to update partner!');
        });
    },
  });
  
  export const { setSearchTerm, setPerPage, setPage } = partnersSlice.actions;
  
  export default partnersSlice.reducer;