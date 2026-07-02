export type GlobalRole = "admin" | "user" | "organizator" | "judge";

export type RegisterRole = "user" | "judge" | "organizator";

export interface CurrentContext {
  hackathonId: number;
  teamId: number;
  isCaptain: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  global_role: GlobalRole;
  tech_stack: string[] | null;
  current_context: CurrentContext | null;
  hackathon_participations?: any[];
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
