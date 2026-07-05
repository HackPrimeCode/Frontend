import { api } from "@/store/api";
import type {
  HackathonTaskRead,
  HackathonTasksRead,
  TaskCreatePayload,
  TaskUpdatePayload,
} from "../model/taskTypes";

export const tasksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTeamTasks: builder.query<HackathonTasksRead, number>({
      query: (teamId) => ({
        url: `/teams/${teamId}/tasks`,
        method: "GET",
      }),
      providesTags: (_result, _error, teamId) => [
        { type: "Tasks", id: teamId },
      ],
    }),

    createTeamTask: builder.mutation<
      HackathonTaskRead,
      { teamId: number; payload: TaskCreatePayload }
    >({
      query: ({ teamId, payload }) => ({
        url: `/teams/${teamId}/tasks`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Tasks", id: arg.teamId },
      ],
    }),

    updateTeamTask: builder.mutation<
      HackathonTaskRead,
      { teamId: number; taskId: string; payload: TaskUpdatePayload }
    >({
      query: ({ teamId, taskId, payload }) => ({
        url: `/teams/${teamId}/tasks/${taskId}`,
        method: "PATCH",
        data: payload,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Tasks", id: arg.teamId },
      ],
    }),

    deleteTeamTask: builder.mutation<void, { teamId: number; taskId: string }>({
      query: ({ teamId, taskId }) => ({
        url: `/teams/${teamId}/tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Tasks", id: arg.teamId },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTeamTasksQuery,
  useCreateTeamTaskMutation,
  useUpdateTeamTaskMutation,
  useDeleteTeamTaskMutation,
} = tasksApi;
