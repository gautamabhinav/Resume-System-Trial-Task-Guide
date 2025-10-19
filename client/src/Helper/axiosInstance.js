import axios from "axios";

const isDev = import.meta.env.MODE === "development";

const BASE_URL = isDev
  ? "http://localhost:5014/api/v1"
  : import.meta.env.VITE_API_URL || "https://blex-thlc.onrender.com/api/v1";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default axiosInstance;