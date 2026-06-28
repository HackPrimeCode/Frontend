import { api } from "@/store/api";
import type { HackathonPublicRead } from "../model/hackathonTypes";

export const hackathonsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getHackathons: builder.query<HackathonPublicRead[], void>({
      query: () => ({
        url: "/hackathons",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetHackathonsQuery } = hackathonsApi;
