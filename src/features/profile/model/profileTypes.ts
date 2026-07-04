export interface HackathonParticipation {
  id: number;
  hackathon_id: number;
  title: string;
  status: "REGISTRATION" | "IN_PROGRESS" | "FINISHED";
  role?: "captain" | "participant";
  team_name?: string;
  position?: number;
  score?: number;
  date: string;
}

export interface CurrentTeam {
  id: number;
  name: string;
  role: "captain" | "participant";
  members_count: number;
  initials?: string;
  color?: string;
}
