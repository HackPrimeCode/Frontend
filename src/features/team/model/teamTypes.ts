export interface TeamCreateRequest {
  team_name: string;
}

export interface TeamInviteRequest {
  emails: string[];
}

export interface InviteTokenRead {
  token: string;
  email: string;
}

export interface TeamCreateResponse {
  team_id: number;
  team_name: string;
  invite_tokens: InviteTokenRead[];
}

export interface TeamCreateFormData {
  hackathon_id: number;
  team_name: string;
  description: string;
}

export interface TeamMember {
  id: number;
  user_id: number;
  team_id: number;
  email: string;
  full_name: string;
  role: string;
  skills: string[];
  is_captain: boolean;
  avatar_color?: string;
}

export interface Team {
  id: number;
  name: string;
  description: string | null;
  hackathon_id: number;
  hackathon_title: string;
  hackathon_dates: string;
  hackathon_description: string;
  hackathon_topics: string[];
  hackathon_min_size: number;
  hackathon_max_size: number;
  members: TeamMember[];
  pending_invites: string[];
  created_at: string;
}
