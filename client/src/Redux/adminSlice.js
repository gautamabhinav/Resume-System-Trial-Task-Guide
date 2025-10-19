// redux/adminSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosInstance from "../Helper/axiosInstance";

// Initial state
const initialState = {    
  users: [],
  loading: false,
  error: null,
};

// Fetch all users (ADMIN / SUPERADMIN)
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      // state.auth can be undefined during app startup; default to empty object
      const auth = state.auth || {};
      const role = auth.role; // 'ADMIN' or 'SUPERADMIN'
      // console.log(role);

      // SUPERADMIN sees all users including admins
      

      // Admin sees only users
      const endpoint =
        role === "SUPERADMIN" ? "/admin/users" : "/admin/users?filter=user";

      const res = await axiosInstance.get(endpoint, {
        withCredentials : true
      });
      return res.data.users;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);



export const updateUserRole = createAsyncThunk(
  "admin/updateUserRole",
  async ({ userId, role }) => {
    const res = await axiosInstance.put(`/admin/users/${userId}/role`, { role }, {
      withCredentials : true
    });
    toast.success(res.data.message);
    return res.data.user;
  }
);


const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchUsers
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateUserRole
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const idx = state.users.findIndex(u => u._id === action.payload._id);
        if (idx !== -1) state.users[idx].role = action.payload.role;
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export default adminSlice.reducer;
