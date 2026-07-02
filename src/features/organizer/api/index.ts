import { api } from "@/store/api";
import type {
  HackathonDetailRead,
  HackathonDetailsWithTask,
} from "@/features/organizer/model/organizerTypes";

const mockOrganizerHackathon: HackathonDetailsWithTask = {
  id: 1,
  title: "HackPrimeCode Лето 2026",
  description:
    "Флагманский хакатон от платформы. 48 часов интенсивной командной работы над реальными задачами.",
  status: "IN_PROGRESS",
  event_location: "Moscow",
  prizes: [
    { id: 1, title: "1-е место", reward: "300000" },
    { id: 2, title: "2-е место", reward: "150000" },
    { id: 3, title: "3-е место", reward: "50000" },
  ],
  topics: ["ML", "Python", "React", "Go"],
  min_team_size: 1,
  max_team_size: 4,
  max_participants: 1000,
  total_participants: 847,
  total_teams: 142,
  start_date: "2026-07-01T18:00:00",
  end_date: "2026-07-12T12:00:00",
  submission_requirements: [
    "Команда от 1 до 4 человек",
    "Регистрация обязательна до начала хакатона",
  ],
  task: "Умный AI-мерчандайзер и персональный шопер",
  task_description:
    "Участникам предстоит создать прототип интеллектуальной мультимодальной системы для физических магазинов.",
  functional_requirements: [
    "Команда от 1 до 4 человек",
    "Регистрация обязательна до начала хакатона",
  ],
  technical_limitations: [
    "Команда от 1 до 4 человек",
    "Регистрация обязательна до начала хакатона",
  ],
  evaluation_criteria: [
    "Команда от 1 до 4 человек",
    "Регистрация обязательна до начала хакатона",
  ],
  files: [
    { name: "task_specification.pdf", size: "1.2 MB" },
    { name: "starter_template.zip", size: "4.7 MB" },
  ],
};

export const organizerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizerHackathon: builder.query<
      HackathonDetailsWithTask | null,
      void
    >({
      queryFn: () => ({ data: mockOrganizerHackathon }),
      providesTags: ["OrganizerHackathon"],
    }),
    getOrganizerHackathonDetails: builder.query<
      HackathonDetailRead | null,
      number
    >({
      queryFn: () => ({ data: mockOrganizerHackathon }),
      providesTags: ["OrganizerHackathon"],
    }),
  }),
});

export const { useGetOrganizerHackathonQuery, useGetOrganizerHackathonDetailsQuery } =
  organizerApi;
