import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./baseQuery";

export const api = createApi({
  reducerPath: "api/v1",
  baseQuery: axiosBaseQuery,
  tagTypes: [
    "User",
    "Hackathons",
    "Team",
    "OrganizerHackathon",
    "Tasks",
    "Submission",
    "Judge",
  ],
  endpoints: () => ({}),
});
