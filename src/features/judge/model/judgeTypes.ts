export interface JudgeTeam {
  id: number;
  name: string;
  members_count: number;
  submission_status: "submitted" | "checked";
  average_score?: number;
}

export interface JudgeTeamDetails {
  id: number;
  name: string;

  submission: {
    description: string;
    repository_url: string;
    files: string[];
  };

  current_score?: {
    idea: number;
    implementation: number;
    quality: number;
    design: number;
  };
}
