import { api } from "@/store/api";
import type {
  HackathonDetailRead,
  HackathonDetailsWithTask,
} from "../model/hackathonTypes";

export const hackathonsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getHackathons: builder.query<HackathonDetailRead[], void>({
      query: () => ({
        url: "/hackathons",
        method: "GET",
      }),
      transformResponse: (response: any[]): HackathonDetailRead[] => {
        return response.map((h) => ({
          id: h.id,
          title: h.title,
          description: h.description,
          status: h.status,
          event_location: h.place || "Online",
          prizes: h.prizes || [],
          topics: h.topics || [],
          min_team_size: h.min_team_size,
          max_team_size: h.max_team_size,
          max_participants: h.max_participants,
          current_participants: h.current_participants || 0,
          current_teams: h.current_teams || 0,
          start_date: h.start_date,
          end_date: h.end_date,
          submission_requirements: h.submission_requirements || [],
        }));
      },
    }),

    getHackathonDetailsWithTask: builder.query<
      HackathonDetailsWithTask,
      number
    >({
      query: (hackathonId) => ({
        url: `/hackathons/hackathons/${hackathonId}/details-with-task`,
        method: "GET",
      }),
      transformResponse: (h: any): HackathonDetailsWithTask => {
        return {
          id: h.id,
          title: h.title,
          description: h.description,
          status: h.status,
          event_location: h.place || "Online",
          prizes: h.prizes || [],
          topics: h.topics || [],
          min_team_size: h.min_team_size,
          max_team_size: h.max_team_size,
          max_participants: h.max_participants,
          current_participants: h.current_participants || 0,
          current_teams: h.current_teams || 0,
          start_date: h.start_date,
          end_date: h.end_date,
          submission_requirements: h.submission_requirements || [],

          task: h.task || "Техническое задание отсутствует",
          task_description: h.task_description || h.description,
          functional_requirements: h.functional_requirements || [],
          technical_limitations: h.technical_limitations || [],
          evaluation_criteria: h.evaluation_criteria || [],
          files: h.files || [],
        };
      },
    }),
  }),
});

export const { useGetHackathonsQuery, useGetHackathonDetailsWithTaskQuery } =
  hackathonsApi;
