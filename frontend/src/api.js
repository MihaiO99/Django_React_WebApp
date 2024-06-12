import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const isDevelopment = import.meta.env.MODE === 'development'
const baseUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_PROD

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json", 
    accept: "application/json"
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;