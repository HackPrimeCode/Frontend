import type { HackathonDetailRead } from "@/features/hackathons/model/hackathonTypes";
import type { TeamProfileRead } from "@/features/team/model/teamTypes";

export type GlobalRole = "admin" | "user" | "organizator" | "judge";

export type RegisterRole = "user" | "judge" | "organizator";

export interface CurrentContext {
  hackathonId: number;
  teamId: number;
  roleInTeam: string | null;
}

export interface PrizeResponse {
  id: number;
  place: number;
  amount: number;
  description?: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  tech_stack: string[] | null;
  global_role: GlobalRole;
  active_hackathon: HackathonDetailRead;
  current_team: TeamProfileRead | null;
  past_hackathons: HackathonDetailRead[];
}

export interface AuthResponse {
  user: User;
  access_token: string;
  token_type: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isInitialized: boolean;
  context: CurrentContext | null;
}
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  name: string;
  password: string;
}

export interface ValidateInviteResponse {
  email: string;
  role: "judge" | "organizator";
}
