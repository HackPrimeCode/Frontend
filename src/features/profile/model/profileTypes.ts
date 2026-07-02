export interface ProfileStats {
  total_hackathons: number;
  total_wins: number;
  average_score: number;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  github_url?: string;
  skills: string[];
  stats: ProfileStats;
}

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

export interface CurrentHackathon {
  id: number;
  title: string;
  description: string;
  status: "REGISTRATION" | "IN_PROGRESS" | "FINISHED";
  skills?: string[];
  date: string;
  location: string;
  duration_hours: number;
  team_name?: string;
  team_members?: number;
  deadline?: string;
}
