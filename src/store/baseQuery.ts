import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { AxiosError, type AxiosRequestConfig } from "axios";
import apiClient from "../api/apiClient";

type AxiosBaseQueryArgs = {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
};

export const axiosBaseQuery: BaseQueryFn<
  AxiosBaseQueryArgs,
  unknown,
  unknown
> = async ({ url, method = "get", data, params }) => {
  const MAX_RETRIES = 2;
  const RETRY_DELAY = 300;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await apiClient({ url, method, data, params });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;

      const isNetworkError =
        !err.response ||
        err.response.status === 502 ||
        err.response.status === 504;

      if (attempt < MAX_RETRIES && isNetworkError) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        continue;
      }

      if (err.response?.status !== 401) {
        console.error("API Error:", err.message);
      }

      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  }

  return { error: { status: "CUSTOM_ERROR", data: "Failed after retries" } };
};
