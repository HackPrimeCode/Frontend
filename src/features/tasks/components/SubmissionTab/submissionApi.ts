import { api } from "@/store/api";

export interface SubmissionRead {
  id: number;
  hackathon_id: number;
  team_id: number;
  description: string;
  repository_url: string;
  files: string[] | null;
  submitted_at: string;
}

export interface SubmissionCreatePayload {
  description: string;
  repository_url: string;
  files: string[] | null;
}

export const submissionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSubmission: builder.query<SubmissionRead, number>({
      query: (teamId) => ({
        url: `/${teamId}/submission`,
        method: "GET",
      }),
      providesTags: (_result, _error, teamId) => [
        { type: "Submission", id: teamId },
      ],
    }),

    submitSolution: builder.mutation<
      SubmissionRead,
      { teamId: number; payload: SubmissionCreatePayload }
    >({
      query: ({ teamId, payload }) => ({
        url: `/${teamId}/submit`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Submission", id: arg.teamId },
      ],
    }),
  }),
  overrideExisting: false,
});

export const { useGetSubmissionQuery, useSubmitSolutionMutation } =
  submissionApi;
