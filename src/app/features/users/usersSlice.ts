import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { rulesState } from "../../types";
import axiosInstance from "../../../axios";
import toast from "react-hot-toast";
import { User, UsersState } from "../../types";

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  currentPage: 1,
  perPage: 10,
  totalPages: 0,
  totalItem: 0,
  searchTerm: "",
  userDetail: null,
  bannedUsers: [],
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (
    {
      page,
      perPage,
      searchTerm,
    }: { page: number; perPage: number; searchTerm: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get("/users", {
        params: {
          page,
          limit: perPage,
          searchKey: searchTerm,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching users"
      );
    }
  }
);
export const generateExcelFile = createAsyncThunk(
  "users/generateExcelFile", // Fixed typo and more descriptive name
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users/export`, {
        headers: {
          Accept:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
        responseType: "blob", // This is crucial for file downloads
      });

      // Response is already a blob due to responseType: 'blob'
      const blob = response.data;

      // Get filename from response headers or use a default
      const contentDisposition = response.headers["content-disposition"];
      let filename = "users_export.xlsx"; // Changed to .xlsx for Excel files

      if (contentDisposition) {
        const match = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (match && match[1]) {
          filename = match[1].replace(/['"]/g, "");
        }
      }

      // Create a link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      return {
        success: true,
        message: "Excel file downloaded successfully",
        filename,
      };
    } catch (err: any) {
      console.error("Excel export error:", err);

      // Better error handling
      let errorMessage = "Failed to export participants";

      if (err.response) {
        // Server responded with error status
        errorMessage =
          err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = "Network error: No response from server";
      } else {
        // Something else happened
        errorMessage = err.message || "Unknown error occurred";
      }

      return rejectWithValue(errorMessage);
    }
  }
);
export const fetchBannedUsers = createAsyncThunk(
  "users/fetchBannedUsers",
  async (
    {
      page,
      perPage,
      searchTerm,
    }: { page: number; perPage: number; searchTerm: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get("/users/banned", {
        params: {
          page,
          limit: perPage,
          searchKey: searchTerm,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching users"
      );
    }
  }
);
export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users?id=${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching user"
      );
    }
  }
);

export const addUser = createAsyncThunk(
  "users/addUser",
  async (user: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users/register", user, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error adding user"
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (
    { id, user }: { id: string; user: Partial<User> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(`/users?id=${id}`, user, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating user"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/users?id=${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error deleting user"
      );
    }
  }
);

const usersSlice = createSlice({
  name: "users",
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
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data?.result;
        state.totalPages = action.payload.data.totalPages;
        state.totalItem = action.payload.data.totalItem;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchBannedUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBannedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.bannedUsers = action.payload.data?.result;
        state.totalPages = action.payload.data.totalPages;
        state.totalItem = action.payload.data.totalItem;
      })
      .addCase(fetchBannedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetail = action.payload.data;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(addUser.fulfilled, (state) => {
        state.loading = false;
        toast.success("User added successfully!");
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to add user!");
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.loading = false;
        toast.success("User updated successfully!");
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to update user!");
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
        toast.success("User deleted successfully!");
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to deleted user!");
      });
  },
});

export const { setSearchTerm, setPerPage, setPage } = usersSlice.actions;

export default usersSlice.reducer;
