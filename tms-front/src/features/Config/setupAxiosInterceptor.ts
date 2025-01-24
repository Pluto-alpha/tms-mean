import axios from "axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { refreshToken, logout } from "../../features/auth/authSlice";

// Setup Axios interceptor
const setupAxiosInterceptor = () => {
  const dispatch = useDispatch<AppDispatch>();
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await dispatch(refreshToken());
          const newAccessToken = localStorage.getItem("token");
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } catch (err) {
          dispatch(logout());
          console.error("Token refresh failed:", err);
        }
      }
      return Promise.reject(error);
    }
  );
};

setupAxiosInterceptor();
