export type HackathonStatus =
  | "DRAFT"
  | "REGISTRATION"
  | "IN_PROGRESS"
  | "FINISHED";

export type HackathonLocation =
  | "Moscow"
  | "Saint Petersburg"
  | "Online"
  | "Kazan";

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
  event_location: HackathonLocation;
  prizes: PrizeResponse[];
  topics: string[] | null;
  min_team_size: number;
  max_team_size: number;
  max_participants: number | null;
  current_participants: number;
  current_teams: number;
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
