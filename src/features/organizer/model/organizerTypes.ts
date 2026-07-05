export type HackathonStatus =
  | "DRAFT"
  | "REGISTRATION"
  | "IN_PROGRESS"
  | "FINISHED";

export type HackathonLocation =
  | "Москва"
  | "Санкт-Петербург"
  | "Казань"
  | "Нижний-Новгород"
  | "Онлайн";

export interface PrizeResponse {
  id: number;
  title: string;
  reward: string;
}

export interface File {
  name: string;
  size: string;
}

export interface HackathonDetailRead {
  id: number;
  title: string;
  description: string | null;
  status: HackathonStatus;
  place: HackathonLocation;
  prizes: PrizeResponse[];
  topics: string[] | null;
  min_team_size: number;
  max_team_size: number;
  max_participants: number | null;
  total_participants: number;
  total_teams: number;
  start_date: string;
  end_date: string;
  submission_requirements: string[] | null;
}

export interface HackathonDetailsWithTask extends HackathonDetailRead {
  task: string;
  task_description: string | null;
  functional_requirements: string[] | null;
  technical_limitations: string[] | null;
  evaluation_criteria: string[] | null;
  files: File[] | null;
}

export interface HackathonAdminListItem {
  id: number;
  title: string;
}

export interface AdminTeamStatsRead {
  id: number;
  name: string;
  members_count: number;
}

export interface HackathonSpecificationRead {
  task: string;
  task_description: string | null;
  functional_requirements: string[] | null;
  technical_limitations: string[] | null;
  evaluation_criteria: string[] | null;
  files: string[] | null;
}

export interface AdminHackathonDetailRead {
  id: number;
  title: string;
  description: string | null;
  status: HackathonStatus;
  place: HackathonLocation;
  min_team_size: number;
  max_team_size: number;
  max_participants: number | null;
  total_participants: number;
  total_teams: number;
  start_date: string;
  end_date: string;
  topics: string[] | null;
  submission_requirements: string[] | null;
  prizes: PrizeResponse[];
  specification: HackathonSpecificationRead | null;
  teams: AdminTeamStatsRead[];
}

export interface HackathonSpecificationCreate {
  task: string;
  task_description: string | null;
  functional_requirements: string[] | null;
  technical_limitations: string[] | null;
  evaluation_criteria: string[] | null;
  files: string[] | null;
}

export interface HackathonCreate {
  title: string;
  description: string | null;
  place: HackathonLocation;
  min_team_size: number | null;
  max_team_size: number | null;
  start_date: string | null;
  end_date: string | null;
  prizes: PrizeCreate[];
  topics: string[] | null;
  max_participants: number | null;
  submission_requirements: string[] | null;
}

export interface PrizeCreate {
  title: string;
  reward: string;
}
