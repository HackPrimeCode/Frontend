import { api } from "@/store/api";
import { updateUser } from "@/features/auth/model/authSlice";
import type { User } from "@/features/auth/model/authTypes";

export const profileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<User, void>({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      providesTags: ["User"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateUser(data));
        } catch (error) {
          console.error("Failed to sync profile to auth state:", error);
        }
      },
    }),
    updateUserProfile: builder.mutation<User, Partial<User>>({
      query: (updates) => ({
        url: "/users/me",
        method: "PUT",
        data: updates,
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateUser(data));
        } catch {}
      },
    }),
  }),
});

export const { useGetUserProfileQuery, useUpdateUserProfileMutation } =
  profileApi;
