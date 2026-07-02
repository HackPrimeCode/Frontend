import { api } from "@/store/api";
import type {
  Team,
  TeamCreateRequest,
  TeamCreateResponse,
  InviteTokenRead,
} from "../model/teamTypes";

const mockTeam: Team = {
  id: 1,
  name: "ByteForce",
  description:
    "Мы — сыгранная команда инженеров, готовая к вызовам HackPrimeCode Лето 2026.",
  hackathon_id: 1,
  hackathon_title: "HackPrimeCode Лето 2026",
  hackathon_dates: "18-20 июля 2026",
  hackathon_description:
    "HackPrimeCode Лето 2026 - специализированный хакатон для разработчиков в области ML и AI.",
  hackathon_topics: ["ML", "Python", "React", "Go"],
  hackathon_min_size: 1,
  hackathon_max_size: 4,
  members: [
    {
      id: 1,
      user_id: 1,
      team_id: 1,
      email: "killoq7@gmail.com",
      full_name: "Алексей Иванов",
      skills: ["ML", "Python", "React", "Go"],
      is_captain: true,
      avatar_color: "bg-red",
    },
    {
      id: 2,
      user_id: 1111,
      team_id: 1,
      email: "m.volkova@gmail.com",
      full_name: "Мария Волкова",
      skills: ["ML", "Python", "React", "Go"],
      is_captain: false,
      avatar_color: "bg-green-500",
    },
  ],
  pending_invites: ["o.sidorova@example.com"],
  created_at: "2026-06-20T10:00:00",
};

export const teamsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Подключить реальный API, когда бэк будет готов
    getMyTeam: builder.query<Team | null, void>({
      queryFn: () => {
        return { data: mockTeam };
      },
      // query: () => ({
      //   url: "/teams/my",
      //   method: "GET",
      // }),
      providesTags: ["Team"],
    }),

    // POST /hackathons/{hackathon_id}/teams
    createTeam: builder.mutation<
      TeamCreateResponse,
      { hackathon_id: number; data: TeamCreateRequest }
    >({
      query: ({ hackathon_id, data }) => ({
        url: `/hackathons/${hackathon_id}/teams`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Team"],
    }),

    // POST /teams/{team_id}/invite
    inviteToTeam: builder.mutation<
      InviteTokenRead[],
      { teamId: number; emails: string[] }
    >({
      query: ({ teamId, emails }) => ({
        url: `/teams/${teamId}/invite`,
        method: "POST",
        body: { emails },
      }),
      invalidatesTags: ["Team"],
    }),

    // DELETE /teams/members/{memberId}
    removeMember: builder.mutation<void, { memberId: number }>({
      query: ({ memberId }) => ({
        url: `/teams/members/${memberId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Team"],
    }),
  }),
});

export const {
  useGetMyTeamQuery,
  useCreateTeamMutation,
  useInviteToTeamMutation,
  useRemoveMemberMutation,
} = teamsApi;
