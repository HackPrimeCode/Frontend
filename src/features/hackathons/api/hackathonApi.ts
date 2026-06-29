import { api } from "@/store/api";
import type { HackathonDetailRead } from "../model/hackathonTypes";
import { mockHackathons } from "./mockHackathons";

export const hackathonsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getHackathons: builder.query<HackathonDetailRead[], void>({
      query: () => ({
        url: "/hackathons",
        method: "GET",
      }),
      transformResponse: () => mockHackathons,
    }),
  }),
});

export const { useGetHackathonsQuery } = hackathonsApi;
