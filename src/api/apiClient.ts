import axios from "axios";
import { logout, updateAccessToken } from "../features/auth/model/authSlice";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  withCredentials: true,
});

apiClient.interceptors.request.use(async (config) => {
  const { store } = await import("../store");
  const token = store.getState().auth.accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const { accessToken } = response.data;

        const { store } = await import("../store");
        store.dispatch(updateAccessToken(accessToken));

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        const { store } = await import("../store");
        store.dispatch(logout());
        window.location.assign("/auth");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
