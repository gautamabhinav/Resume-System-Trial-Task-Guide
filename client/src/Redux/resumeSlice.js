// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axiosInstance from "../Helper/axiosInstance";

// const initialState = {
//   resume: null,
//   loading: false,
//   error: null,
// };

// // 🎯 Thunk: Fetch Resume by userId
// export const fetchResume = createAsyncThunk(
//   "resume/fetchResume",
//   async (userId, { rejectWithValue }) => {
//     try {
//       const res = await axiosInstance.get(`/resume/${userId}`, {
//         withCredentials: true,
//       });
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to fetch resume"
//       );
//     }
//   }
// );

// // 🎯 Thunk: Create or Update Resume
// export const saveResume = createAsyncThunk(
//   "resume/saveResume",
//   async (data, { rejectWithValue }) => {
//     try {
//       const res = await axiosInstance.post("/resume", data, {
//         withCredentials: true,
//       });
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to save resume"
//       );
//     }
//   }
// );

// const resumeSlice = createSlice({
//   name: "resume",
//   initialState,
//   reducers: {
//     clearResume: (state) => {
//       state.resume = null;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch resume
//       .addCase(fetchResume.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchResume.fulfilled, (state, action) => {
//         state.loading = false;
//         state.resume = action.payload;
//       })
//       .addCase(fetchResume.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Save resume
//       .addCase(saveResume.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(saveResume.fulfilled, (state, action) => {
//         state.loading = false;
//         state.resume = action.payload;
//       })
//       .addCase(saveResume.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearResume } = resumeSlice.actions;
// export default resumeSlice.reducer;


import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../Helper/axiosInstance";

// Default empty resume template
const emptyResume = {
  userId: "",
  name: "",
  email: "",
  phone: "",
  summary: "",
  skills: [],
  projects: [],
  internships: [],
  courses: [],
  hackathons: [],
  education: [],
};

const initialState = {
  resume: { ...emptyResume },
  allResumes: [],
  loading: false,
  error: null,
};

// 🎯 Thunks

// Fetch resume by userId
export const fetchResume = createAsyncThunk(
  "resume/fetchResume",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/resume/${userId}`, {
        withCredentials: true,
      });
      console.log("Fetched resume:", res.data);
      return res.data || { ...emptyResume };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch resume"
      );
    }
  }
);

// Save or update resume
export const saveResume = createAsyncThunk(
  "resume/saveResume",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/resume", data, {
        withCredentials: true,
      });
      toast.success(res?.data?.message || "Resume Saved");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to save resume"
      );
    }
  }
);

// Delete resume by userId
export const deleteResume = createAsyncThunk(
  "resume/deleteResume",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/resume/${userId}`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete resume"
      );
    }
  }
);

// Fetch all resumes
export const fetchAllResumes = createAsyncThunk(
  "resume/fetchAllResumes",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/resume", { withCredentials: true });
      console.log("All resumes fetched:", res.data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch resumes"
      );
    }
  }
);

// 🎯 Slice
const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    clearResume: (state) => {
      state.resume = { ...emptyResume };
      state.error = null;
    },
    // Update any single field locally
    updateField: (state, action) => {
      const { field, value } = action.payload;
      if (field in state.resume) state.resume[field] = value;
    },
    // Add item to array field
    addArrayItem: (state, action) => {
      const { field, value } = action.payload;
      // Ensure the target field is an array so pushes always work
      if (!Array.isArray(state.resume[field])) {
        // initialize as empty array if missing/null
        state.resume[field] = [];
      }
      state.resume[field].push(value);
    },
    // Remove item from array field
    removeArrayItem: (state, action) => {
      const { field, index } = action.payload;
      if (!Array.isArray(state.resume[field])) return;
      state.resume[field].splice(index, 1);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch resume
      .addCase(fetchResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResume.fulfilled, (state, action) => {
        state.loading = false;
        state.resume = action.payload || { ...emptyResume };
      })
      .addCase(fetchResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Save resume
      .addCase(saveResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveResume.fulfilled, (state, action) => {
        state.loading = false;
        state.resume = action.payload || state.resume;
      })
      .addCase(saveResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete resume
      .addCase(deleteResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteResume.fulfilled, (state) => {
        state.loading = false;
        state.resume = { ...emptyResume };
      })
      .addCase(deleteResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch all resumes
      .addCase(fetchAllResumes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllResumes.fulfilled, (state, action) => {
        state.loading = false;
        state.allResumes = action.payload || [];
      })
      .addCase(fetchAllResumes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearResume, updateField, addArrayItem, removeArrayItem } =
  resumeSlice.actions;

export default resumeSlice.reducer;
