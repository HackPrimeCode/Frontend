import type { TeamMember } from "@/features/team/model/teamTypes";

export interface HackathonTask {
  id: string;
  title: string;
  tag: string;
  description: string;
  assignee?: {
    name: string;
    color: string;
  };
}

export interface HackathonTasks {
  team_id: string;
  team_members: TeamMember[];
  tasks: {
    backlog: HackathonTask[];
    in_work: HackathonTask[];
    review: HackathonTask[];
    done: HackathonTask[];
  };
}
