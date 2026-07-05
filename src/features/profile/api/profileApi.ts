import { api } from "@/store/api";
import { updateUser, setContext } from "@/features/auth/model/authSlice";
import type { User, CurrentContext } from "@/features/auth/model/authTypes";

export const profileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<User, void>({
      query: () => ({
        url: "/users/me/profile",
        method: "GET",
      }),
      providesTags: ["User"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(updateUser(data));

          const contextData: CurrentContext = {
            hackathonId: data.active_hackathon?.id ?? null,
            teamId: data.current_team?.id ?? null,
            roleInTeam: data.current_team?.role_in_team ?? null,
          };

          dispatch(setContext(contextData));
        } catch (error) {
          console.error("Failed to process user context:", error);
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
export const useGetUserProfileQuery =
  profileApi.endpoints.getUserProfile.useQuery;
export const useGetUserProfileLazyQuery =
  profileApi.endpoints.getUserProfile.useLazyQuery;
export const useUpdateUserProfileMutation =
  profileApi.endpoints.updateUserProfile.useMutation;
