import { api } from "@/store/api";
import type { UserProfile, CurrentHackathon, HackathonParticipation } from "../model/profileTypes";

export const profileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserProfile, void>({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    getCurrentHackathon: builder.query<CurrentHackathon | null, void>({
      query: () => ({
        url: "/users/current-hackathon",
        method: "GET",
      }),
    }),
    getHackathonHistory: builder.query<HackathonParticipation[], void>({
      query: () => ({
        url: "/users/hackathon-history",
        method: "GET",
      }),
    }),
    updateUserProfile: builder.mutation<UserProfile, Partial<UserProfile>>({
      query: (updates) => ({
        url: "/users/me",
        method: "PATCH",
        data: updates,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useGetCurrentHackathonQuery,
  useGetHackathonHistoryQuery,
  useUpdateUserProfileMutation,
} = profileApi;
