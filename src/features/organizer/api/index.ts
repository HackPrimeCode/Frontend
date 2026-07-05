import { api } from "@/store/api";
import type {
  HackathonDetailRead,
  HackathonDetailsWithTask,
  HackathonAdminListItem,
  AdminHackathonDetailRead,
  HackathonCreate,
  HackathonSpecificationCreate,
  HackathonSpecificationRead,
} from "@/features/organizer/model/organizerTypes";

export const organizerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizerHackathon: builder.query<
      HackathonDetailsWithTask | null,
      void
    >({
      query: () => ({
        url: "/hackathons/details-with-task",
        method: "GET",
      }),
      providesTags: ["OrganizerHackathon"],
    }),
    getOrganizerHackathonDetails: builder.query<
      AdminHackathonDetailRead | null,
      number
    >({
      query: (hackathonId) => ({
        url: `/admin/hackathons/${hackathonId}`,
        method: "GET",
      }),
      providesTags: ["OrganizerHackathon"],
    }),
    getAdminHackathonsList: builder.query<
      HackathonAdminListItem[],
      void
    >({
      query: () => ({
        url: "/admin/hackathons/hack_list",
        method: "GET",
      }),
      providesTags: ["AdminHackathons"],
    }),
    createHackathon: builder.mutation<
      HackathonDetailRead,
      FormData
    >({
      query: (formData) => ({
        url: "/admin/hackathons",
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: ["OrganizerHackathon"],
    }),
    updateHackathon: builder.mutation<
      HackathonDetailRead,
      { hackathonId: number; data: Partial<HackathonCreate> }
    >({
      query: ({ hackathonId, data }) => ({
        url: `/admin/hackathons/${hackathonId}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["OrganizerHackathon"],
    }),
    createHackathonSpecification: builder.mutation<
      HackathonSpecificationRead,
      { hackathonId: number; data: HackathonSpecificationCreate }
    >({
      query: ({ hackathonId, data }) => ({
        url: `/admin/hackathons/${hackathonId}/specification`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["OrganizerHackathon"],
    }),
    updateHackathonSpecification: builder.mutation<
      HackathonSpecificationRead,
      { hackathonId: number; data: HackathonSpecificationCreate }
    >({
      query: ({ hackathonId, data }) => ({
        url: `/admin/hackathons/${hackathonId}/specification`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["OrganizerHackathon"],
    }),
  }),
});

export const {
  useGetOrganizerHackathonQuery,
  useGetOrganizerHackathonDetailsQuery,
  useGetAdminHackathonsListQuery,
  useCreateHackathonMutation,
  useUpdateHackathonMutation,
  useCreateHackathonSpecificationMutation,
  useUpdateHackathonSpecificationMutation,
} = organizerApi;
