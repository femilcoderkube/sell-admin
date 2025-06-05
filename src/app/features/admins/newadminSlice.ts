import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../axios";

interface SubModule {
  name: string;
  hasAccess: boolean;
}

interface Module {
  name: string;
  hasAccess: boolean;
  subModules?: SubModule[];
}

interface AdminAccessModule {
  _id?: string;
  nameEn: string;
  nameAr: string;
  key: string;
  subModules?: {
    _id?: string;
    nameEn: string;
    nameAr: string;
    key: string;
  }[];
}

interface NewAdminState {
  accessModules: AdminAccessModule[];
  loading: boolean;
  error: string | null;
}

const initialState: NewAdminState = {
  accessModules: [],
  loading: false,
  error: null,
};

export const createAdmin = createAsyncThunk(
  "newadmin/createAdmin",
  async (
    adminData: {
      userName: string;
      role: string;
      email: string;
      password: string;
      phoneNumber: string;
      adminAccess: { modules: Module[] };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/admin", adminData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error creating admin"
      );
    }
  }
);

export const fetchAccessModules = createAsyncThunk(
  "newadmin/fetchAccessModules",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get("/AdminAccess/modules", {
        data: credentials,
      });
      return response.data.data?.modules || [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching access modules"
      );
    }
  }
);

const newadminSlice = createSlice({
  name: "newadmin",
  initialState,
  reducers: {
    clearAdminData: (state) => {
      state.accessModules = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdmin.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAccessModules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccessModules.fulfilled, (state, action) => {
        state.loading = false;
        state.accessModules = action.payload;
      })
      .addCase(fetchAccessModules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAdminData } = newadminSlice.actions;
export default newadminSlice.reducer;
