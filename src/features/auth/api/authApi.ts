import { api } from "@/store/api";
import type { AuthResponse } from "../model/authTypes";
import { setCredentials, setInitialized } from "../model/authSlice";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    refreshSession: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch {
          console.error("Refresh session failed");
        } finally {
          dispatch(setInitialized(true));
        }
      },
    }),
  }),
});

export const { useRefreshSessionMutation } = authApi;
