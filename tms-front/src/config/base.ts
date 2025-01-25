import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:8081',
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
