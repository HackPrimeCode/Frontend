export type TaskStatus = "backlog" | "in_work" | "review" | "done";

export interface TeamMemberRead {
  id: number;
  user_id: number;
  team_id: number;
  email: string;
  name: string;
  skills: string[];
  is_captain: boolean;
  avatar_color: string | null;
}

export interface TaskAssigneeRead {
  assignee_id: string;
  name: string;
  color: string;
}

export interface HackathonTaskRead {
  id: string;
  title: string;
  tag: string;
  description: string;
  assignee: TaskAssigneeRead | null;
}

export interface TaskColumnsRead {
  backlog: HackathonTaskRead[];
  in_work: HackathonTaskRead[];
  review: HackathonTaskRead[];
  done: HackathonTaskRead[];
}

export interface HackathonTasksRead {
  team_id: string;
  team_members: TeamMemberRead[];
  tasks: TaskColumnsRead;
}

export interface TaskCreatePayload {
  title: string;
  tag?: string;
  description?: string;
  assignee_id?: number | null;
}

export interface TaskUpdatePayload {
  title?: string | null;
  tag?: string | null;
  description?: string | null;
  assignee_id?: number | null;
  status?: TaskStatus | null;
  position?: number | null;
}
