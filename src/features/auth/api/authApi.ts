import { api } from "@/store/api";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from "../model/authTypes";
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
  }),
});

export const {
  useRefreshSessionMutation,
  useLoginMutation,
  useRegisterUserMutation,
} = authApi;
