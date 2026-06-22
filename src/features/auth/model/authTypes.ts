export type GlobalRole = "USER" | "ORGANIZER" | "ADMIN";
export type LocalRole = "CAPTAIN" | "MEMBER" | "JURY";

export interface User {
  id: number;
  name: string;
  email: string;
  role: GlobalRole;
}

export interface CurrentContext {
  hackathonId: number;
  teamId: number | null;
  localRole: LocalRole | null;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isInitialized: boolean;
  currentContext: CurrentContext | null;
}
