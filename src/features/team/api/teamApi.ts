import { api } from "@/store/api";
import type {
  TeamDetailRead,
  TeamCreateResponse,
  InviteTokenRead,
  TeamCreateFormData,
} from "../model/teamTypes";

export const teamsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTeamById: builder.query<TeamDetailRead, number>({
      query: (teamId) => ({
        url: `/teams/${teamId}`,
        method: "GET",
      }),
      providesTags: ["Team"],
    }),

    createTeam: builder.mutation<TeamCreateResponse, TeamCreateFormData>({
      query: ({ hackathon_id, teamPayload }) => ({
        url: `/hackathons/${hackathon_id}/teams`,
        method: "POST",
        data: teamPayload,
      }),
      invalidatesTags: ["Team", "User"],
    }),

    inviteToTeam: builder.mutation<
      InviteTokenRead[],
      { teamId: number; emails: string[] }
    >({
      query: ({ teamId, emails }) => ({
        url: `/teams/${teamId}/invite`,
        method: "POST",
        data: { emails },
      }),
      invalidatesTags: ["Team"],
    }),

    removeMember: builder.mutation<void, { teamId: number; userId: number }>({
      query: ({ teamId, userId }) => ({
        url: `/teams/${teamId}/members/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Team"],
    }),

    cancelInvite: builder.mutation<void, { teamId: number; token: string }>({
      query: ({ teamId, token }) => ({
        url: `/teams/${teamId}/invites/${token}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Team"],
    }),
  }),
});

export const {
  useGetTeamByIdQuery,
  useCreateTeamMutation,
  useInviteToTeamMutation,
  useRemoveMemberMutation,
  useCancelInviteMutation,
} = teamsApi;
