import axios from "axios";
import { logout } from "./app/features/auth/authSlice";

export const baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: `${baseURL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

let reduxStore: any = null;
export const setAxiosStore = (storeInstance: any) => {
  reduxStore = storeInstance;
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("401 detected, logging out...");
      if (reduxStore) {
        reduxStore.dispatch(logout());
      }
      localStorage.clear();
      // Optionally, force reload or redirect to login
      // window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
