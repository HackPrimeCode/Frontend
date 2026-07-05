interface LeaderboardHackathonItem {
  id: number;
  title: string;
}

interface TeamLeaderboardServerResponse {
  team_id: number;
  team_name: string;
  average_score: number;
  idea: number;
  implementation: number;
  quality: number;
  design: number;
}

interface LeaderboardEntry {
  id: number;
  teamName: string;
  teamInitial: string;
  teamColor: string;
  total: number;
  idea: number;
  implementation: number;
  quality: number;
  design: number;
}

import { api } from "@/store/api";

export const leaderboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getLeaderboardHackathons: builder.query<LeaderboardHackathonItem[], void>({
      query: () => ({
        url: "/leaderboard/hackathons",
        method: "GET",
      }),
    }),

    getLeaderboard: builder.query<LeaderboardEntry[], number>({
      query: (hackathonId) => ({
        url: `/leaderboard/leaderboard/${hackathonId}`,
        method: "GET",
      }),
      transformResponse: (
        response: TeamLeaderboardServerResponse[],
      ): LeaderboardEntry[] => {
        return response.map((entry) => {
          const teamName = entry.team_name || "Без названия";
          const teamInitial = teamName.trim().charAt(0).toUpperCase() || "T";
          const teamColor = "bg-red";

          return {
            id: entry.team_id,
            teamName: teamName,
            teamInitial: teamInitial,
            teamColor: teamColor,
            total: entry.average_score,
            idea: entry.idea,
            implementation: entry.implementation,
            quality: entry.quality,
            design: entry.design,
          };
        });
      },
    }),
  }),
});

export const { useGetLeaderboardHackathonsQuery, useGetLeaderboardQuery } =
  leaderboardApi;
