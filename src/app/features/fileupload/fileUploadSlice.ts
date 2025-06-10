import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../../axios";

// Define the state interface
interface FileUploadState {
  uploadedFile: any; // Adjust type based on API response (e.g., { url: string } or similar)
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: FileUploadState = {
  uploadedFile: null,
  loading: false,
  error: null,
};

// Async thunk for file upload
export const uploadFile = createAsyncThunk(
  "fileUpload/uploadFile",
  async (file: FormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/admin/fileUpload", file, {
        headers: {
          "Accept-Language": "ar",
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error uploading file"
      );
    }
  }
);

// File upload slice
const fileUploadSlice = createSlice({
  name: "fileUpload",
  initialState,
  reducers: {
    resetUploadState: (state) => {
      state.uploadedFile = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.uploadedFile = action.payload.data; // Adjust based on API response structure
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetUploadState } = fileUploadSlice.actions;

export default fileUploadSlice.reducer;
