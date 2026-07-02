import { api } from "@/store/api";
import type {
  UserProfile,
  UserProfileUpdate,
  UserReadResponse,
} from "../model/profileTypes";

function mapUserToProfile(user: UserReadResponse): UserProfile {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    skills: user.tech_stack ?? [],
    stats: {
      total_hackathons: 0,
      total_wins: 0,
      average_score: 0,
    },
  };
}

export const profileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserProfile, void>({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      transformResponse: (response: UserReadResponse) =>
        mapUserToProfile(response),
      providesTags: ["User"],
    }),
    updateUserProfile: builder.mutation<UserProfile, UserProfileUpdate>({
      query: (updates) => ({
        url: "/users/me",
        method: "PUT",
        data: updates,
      }),
      transformResponse: (response: UserReadResponse) =>
        mapUserToProfile(response),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetUserProfileQuery, useUpdateUserProfileMutation } =
  profileApi;
