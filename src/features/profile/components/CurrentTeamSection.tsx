import { Card, CardContent } from "@/components/ui/card";
import type { TeamProfileRead } from "@/features/team/model/teamTypes";

interface CurrentTeamSectionProps {
  team: TeamProfileRead | null;
}

function getMembersLabel(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return `${count} участник`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return `${count} участника`;
  }
  return `${count} участников`;
}

export default function CurrentTeamSection({ team }: CurrentTeamSectionProps) {
  const roleLabel = team?.role_in_team === "captain" ? "Капитан" : "Участник";
  const initials = team?.team_name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="border border-border bg-card-background ring-0">
      <CardContent className="pt-4 sm:pt-5 pb-4 sm:pb-5">
        <p className="mb-3 sm:mb-4 text-[0.625rem] sm:text-[0.6875rem] uppercase tracking-wide text-text-accent">
          Текущая команда
        </p>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full text-xs sm:text-sm font-bold text-text bg-red">
            {initials}
          </span>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-text">
              {team?.team_name}
            </h4>
            <p className="text-xs sm:text-sm text-text-accent">
              {roleLabel} • {getMembersLabel(team?.members_count)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
