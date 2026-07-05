import axios from "axios";
import { logout, updateAccessToken } from "../features/auth/model/authSlice";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

const apiClient = axios.create({
  baseURL: "/api/v1",
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

    const { store } = await import("../store");
    const currentToken = store.getState().auth.accessToken;

    if (originalRequest.url?.includes("/auth/refresh")) {
      const { store } = await import("../store");
      store.dispatch(logout());
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      currentToken &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh") &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/register") &&
      !originalRequest.url?.includes("/invite/")
    ) {
      originalRequest._retry = true;

      try {
        const response = await apiClient.post("/auth/refresh", {});

        const { access_token } = response.data;

        const { store } = await import("../store");
        store.dispatch(updateAccessToken(access_token));

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        const { store } = await import("../store");
        store.dispatch(logout());
        window.location.assign("/login");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
