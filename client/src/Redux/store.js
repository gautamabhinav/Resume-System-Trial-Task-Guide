import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "../Redux/authSlice";
import adminSliceReducer from "../Redux/adminSlice";
import aiSliceReducer from "../Redux/aiSlice";
import resumeSliceReducer from "../Redux/resumeSlice";


const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    admin: adminSliceReducer,
    ai: aiSliceReducer,
    resume: resumeSliceReducer,
  },
});

export default store;