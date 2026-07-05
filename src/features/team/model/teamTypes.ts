import type { HackathonDetailRead } from "@/features/hackathons/model/hackathonTypes";

export type ParticipantRole = "captain" | "member";

export interface TeamMemberRead {
  id: number;
  name: string;
  role: ParticipantRole;
  email: string;
  tech_stack: string[];
}

export interface InviteTokenRead {
  token: string;
  email: string;
}

export interface TeamProfileRead {
  id: number;
  team_name: string;
  members_count: number;
  role_in_team: ParticipantRole;
}

export interface TeamDetailRead {
  id: number;
  name: string;
  hackathon: HackathonDetailRead;
  description: string;
  members: TeamMemberRead[];
  members_count: number;
  max_team_size: number | null;
  pending_invites: InviteTokenRead[];
}

export interface TeamCreateRequest {
  team_name: string;
  description: string;
}

export interface TeamCreateFormData {
  hackathon_id: number;
  teamPayload: TeamCreateRequest;
}

export interface TeamCreateResponse {
  team_id: number;
  team_name: string;
  invite_tokens: InviteTokenRead[];
}

export interface TeamInviteRequest {
  emails: string[];
}
