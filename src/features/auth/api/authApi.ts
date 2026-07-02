import { api } from "@/store/api";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from "../model/authTypes";
import { logout, setCredentials, setInitialized } from "../model/authSlice";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    refreshSession: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
      invalidatesTags: (result) => (result ? [] : ["User"]),
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
    login: builder.mutation<AuthResponse, LoginPayload>({
      query: (userData) => ({
        url: "/auth/login",
        method: "POST",
        data: userData,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch {
          console.error("Login failed");
        }
      },
    }),
    registerUser: builder.mutation<AuthResponse, RegisterPayload>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        data: userData,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch {
          console.error("Registration failed");
        }
      },
    }),
    logout: builder.mutation<{ detail: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
        } catch {
          console.error("Logout failed");
        }
      },
    }),
  }),
});

export const {
  useRefreshSessionMutation,
  useLoginMutation,
  useRegisterUserMutation,
  useLogoutMutation,
} = authApi;
