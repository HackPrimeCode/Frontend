import { Card, CardContent } from "@/components/ui/card";
import type { CurrentTeam } from "../model/profileTypes";

interface CurrentTeamSectionProps {
  team: CurrentTeam | null | undefined;
  isLoading: boolean;
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

export default function CurrentTeamSection({
  team,
  isLoading,
}: CurrentTeamSectionProps) {
  if (isLoading || !team) {
    return null;
  }

  const roleLabel = team.role === "captain" ? "Капитан" : "Участник";
  const initials =
    team.initials ??
    team.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <Card className="border border-border bg-card-background ring-0">
      <CardContent className="pt-5 pb-5">
        <p className="mb-4 text-[0.6875rem] uppercase tracking-wide text-text-accent">
          Текущая команда
        </p>

        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-text"
            style={{ backgroundColor: team.color ?? "#7B5EA7" }}
          >
            {initials}
          </span>
          <div>
            <h4 className="text-base font-bold text-text">{team.name}</h4>
            <p className="text-sm text-text-accent">
              {roleLabel} • {getMembersLabel(team.members_count)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
