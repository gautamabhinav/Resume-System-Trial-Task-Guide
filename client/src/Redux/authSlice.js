import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosInstance from "../Helper/axiosInstance";

// ✅ Initial state safely from localStorage
const storedData = localStorage.getItem("data");
const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
  role: localStorage.getItem("role") || "",
  data: storedData && storedData !== "undefined" ? JSON.parse(storedData) : {},
  loading: false,
  error: null,
};

// ============================
// Async Thunks
// ============================

// Signup
export const createAccount = createAsyncThunk(
  "auth/signup",
  async (data, { rejectWithValue }) => {
    try {
      let res = await axiosInstance.post("/user/register" , data, {
        withCredentials: true
      });

      toast.success(res?.data?.message || "Account created successfully");
      return res.data;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// Login
export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      let res = await axiosInstance.post("/user/login", data, {
        withCredentials: true
      });
      toast.success(res?.data?.message || "Logged in successfully");
      return res.data;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// Logout
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      let res = await axiosInstance.post("/user/logout", {
        withCredentials : true
      });
      toast.success(res?.data?.message || "Logged out successfully");
      return res.data;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// Fetch current user
export const getUserData = createAsyncThunk(
  "auth/getUserData",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/user/me" ,{
        withCredentials : true
      });
      return res.data;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// Update profile
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async ({ userId, formData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/user/update/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials : true
      });
      toast.success(res?.data?.message || "Profile updated");
      return res.data;
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to update profile";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);


// // function to change user password
export const changePassword = createAsyncThunk(
  "/auth/changePassword",
  async (userPassword) => {
    try {
      let res = axiosInstance.post("/user/change-password", userPassword, {
        withCredentials : true
      });
      // dispatch(connectSocket());

      await toast.promise(res, {
        loading: "Loading...",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to change password",
      });

      // getting response resolved here
      res = await res;
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

// function to handle forget password
export const forgetPassword = createAsyncThunk(
  "auth/forgetPassword",
  async (email) => {
    try {
      let res = axiosInstance.post("/user/reset", { email }, {
        withCredentials : true
      });
      // dispatch(connectSocket());

      await toast.promise(res, {
        loading: "Loading...",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to send verification email",
      });

      // getting response resolved here
      res = await res;
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);


// // function to reset the password
export const resetPassword = createAsyncThunk("/user/reset", async (data) => {
  try {
    let res = axiosInstance.post(`/user/reset/${data.resetToken}`, {
      password: data.password,
      withCredentials : true,
    });
    // dispatch(connectSocket());

    toast.promise(res, {
      loading: "Resetting...",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to reset password",
    });
    // getting response resolved here
    res = await res;
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});




// ============================
// Slice
// ============================

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.data = action.payload.user;
        state.role = action.payload.user.role;

        // Save to localStorage
        localStorage.setItem("data", JSON.stringify(action.payload.user));
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", action.payload.user.role);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.data = {};
        state.role = "";
        localStorage.removeItem("data");
        localStorage.removeItem("role");
        localStorage.removeItem("isLoggedIn");
      })

      // Fetch current user
      .addCase(getUserData.fulfilled, (state, action) => {
        if (action.payload?.user) {
          state.isLoggedIn = true;
          state.data = action.payload.user;
          state.role = action.payload.user.role;
          localStorage.setItem("data", JSON.stringify(action.payload.user));
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("role", action.payload.user.role);
        }
      })
      // Only show error but do NOT clear state
      .addCase(getUserData.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch user data";
      })

      // Update profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        if (action.payload?.user) {
          state.data = action.payload.user;
          state.role = action.payload.user.role;
          localStorage.setItem("data", JSON.stringify(action.payload.user));
          localStorage.setItem("role", action.payload.user.role);
        }
      });
  },
});

export default authSlice.reducer;
