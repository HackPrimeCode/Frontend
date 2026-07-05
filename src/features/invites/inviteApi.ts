import { api } from "@/store/api";

export interface InviteValidationResponse {
  email: string;
  hackathon_id: number;
  hackathon_title: string;
  team_id: number | null;
  team_name: string | null;
  role: "participant" | "judge";
}

export interface InviteActionResponse {
  status: "accepted" | "declined";
}

export const inviteApi = api.injectEndpoints({
  endpoints: (builder) => ({
    validateInvite: builder.query<InviteValidationResponse, string>({
      query: (token) => ({
        url: `/invite/invites/${token}`,
        method: "GET",
        meta: { isPublic: true },
      }),
    }),

    acceptInvite: builder.mutation<InviteActionResponse, string>({
      query: (token) => ({
        url: `/invite/invites/${token}/accept`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    declineInvite: builder.mutation<InviteActionResponse, string>({
      query: (token) => ({
        url: `/invite/invites/${token}/decline`,
        method: "POST",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useValidateInviteQuery,
  useAcceptInviteMutation,
  useDeclineInviteMutation,
} = inviteApi;
