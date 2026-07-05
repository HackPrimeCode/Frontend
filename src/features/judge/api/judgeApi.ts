import { api } from "@/store/api";
import type { JudgeTeam, JudgeTeamDetails } from "../model/judgeTypes";

export const judgeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getJudgeTeams: builder.query<JudgeTeam[], number>({
      query: (hackathonId) => ({
        url: `/judge/hackathons/${hackathonId}/teams`,
      }),
      providesTags: ["Judge"],
    }),

    getJudgeTeam: builder.query<JudgeTeamDetails, number>({
      query: (teamId) => ({
        url: `/judge/teams/${teamId}`,
      }),
      providesTags: ["Judge"],
    }),

    submitScore: builder.mutation<
      void,
      {
        hackathonId: number;
        teamId: number;
        idea: number;
        implementation: number;
        quality: number;
        design: number;
      }
    >({
      query: ({ hackathonId, teamId, ...body }) => ({
        url: `/judge/hackathons/${hackathonId}/teams/${teamId}/score`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Judge"],
    }),
  }),
});

export const { useGetJudgeTeamQuery, useGetJudgeTeamsQuery } = judgeApi;
