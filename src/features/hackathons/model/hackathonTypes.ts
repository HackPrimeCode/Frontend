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

interface PrizeResponse {
  id: number;
  title: string;
  reward: string;
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
  total_participants: number;
  total_teams: number;
  start_date: string;
  end_date: string;
  submission_requirements: string[] | null;
  evaluation_criteria: string[] | null;
}
