import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DevicesState } from "../../types";
import axiosInstance from "../../../axios";
import toast from "react-hot-toast";

const initialState: DevicesState = {
  devices: [],
  loading: false,
  checkloading: false,
  error: null,
  currentPage: 1,
  perPage: 10,
  totalCount: 0,
  searchTerm: "",
};

export const fetchDevices = createAsyncThunk(
  "devices/fetchDevices",
  async (
    {
      page,
      perPage,
      searchTerm,
    }: { page: number; perPage: number; searchTerm: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get("/platforms", {
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

export const addDevice = createAsyncThunk(
  "devices/addDevice",
  async (device: FormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/platforms", device, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error adding device"
      );
    }
  }
);

export const updateDevice = createAsyncThunk(
  "devices/updateDevice",
  async (
    { id, device }: { id: string; device: FormData },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(`/platforms?id=${id}`, device, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error updateing device"
      );
    }
  }
);

export const checkDeviceExists = createAsyncThunk(
  "devices/checkDeviceExists",
  async ({ device, id }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (device) params.append("name", device);
      if (id) params.append("id", id);

      const response = await axiosInstance.get(
        `/platforms/check?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error checking devices existence"
      );
    }
  }
);

export const deleteDevice = createAsyncThunk(
  "devices/deleteDevice",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/platforms?id=${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error deleteing device"
      );
    }
  }
);

const devicesSlice = createSlice({
  name: "devices",
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
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = action.payload.data?.result;
        state.totalCount = action.payload.data.totalItem;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addDevice.pending, (state) => {
        state.loading = true;
      })
      .addCase(addDevice.fulfilled, (state) => {
        state.loading = false;
        toast.success("Device added successfully!");
      })
      .addCase(addDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(updateDevice.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDevice.fulfilled, (state) => {
        state.loading = false;
        toast.success("Device updated successfully!");
      })
      .addCase(updateDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(deleteDevice.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDevice.fulfilled, (state) => {
        state.loading = false;
        toast.success("Device deleted successfully!");
      })
      .addCase(deleteDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(checkDeviceExists.pending, (state) => {
        state.checkloading = true;
      })
      .addCase(checkDeviceExists.fulfilled, (state) => {
        state.checkloading = false;
      })
      .addCase(checkDeviceExists.rejected, (state, action) => {
        state.checkloading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchTerm, setPerPage, setPage } = devicesSlice.actions;

export default devicesSlice.reducer;
