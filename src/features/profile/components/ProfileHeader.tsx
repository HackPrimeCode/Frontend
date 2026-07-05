import { Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { User } from "@/features/auth/model/authTypes";

interface ProfileHeaderProps {
  profile: User | undefined;
  onEditClick: () => void;
  showSkills?: boolean;
  showStats?: boolean;
  roleLabel?: string;
}

export default function ProfileHeader({
  profile,
  onEditClick,
  showSkills = true,
  showStats = true,
  roleLabel,
}: ProfileHeaderProps) {
  const initials = (profile.name || "User")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const totalHackathons = profile.past_hackathons.length ?? 0;

  // const scores = participations
  //   .filter((h) => h.score !== undefined)
  //   .map((h) => h.score!);
  // const averageScore = scores.length
  //   ? scores.reduce((a, b) => a + b, 0) / scores.length
  //   : 0;

  return (
    <Card className="border border-border bg-card-background ring-0">
      <CardContent className="flex flex-col items-center gap-4 sm:gap-5 pt-6 sm:pt-8 pb-4 sm:pb-6">
        <div className="flex h-20 w-20 sm:h-28 sm:w-28 items-center justify-center rounded-full border-2 border-red bg-red text-3xl sm:text-5xl font-bold text-text shadow-[0_0_0_4px_rgba(199,28,37,0.25)]">
          {initials}
        </div>

        <div className="text-center">
          <h2 className="text-lg sm:text-xl font-bold text-text">
            {profile.name}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-text-accent">
            {profile.email}
          </p>
          {roleLabel && (
            <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-medium uppercase tracking-wide text-red">
              {roleLabel}
            </p>
          )}
        </div>

        {showSkills && profile.tech_stack && profile.tech_stack.length > 0 && (
          <div className="w-full">
            <p className="mb-2 sm:mb-2.5 text-[0.625rem] sm:text-[0.6875rem] uppercase tracking-wide text-text-accent">
              Навыки
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {profile.tech_stack.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-input-background px-2 sm:px-2.5 py-0.75 sm:py-1 text-[10px] sm:text-xs text-text"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {showStats && (
          <div className="grid w-full grid-cols-3 gap-2 border-t border-border pt-4 sm:pt-6 text-center">
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl sm:text-3xl font-bold text-red">
                {totalHackathons}
              </span>
              <span className="text-[0.625rem] sm:text-[0.6875rem] uppercase tracking-wide text-text-accent">
                Хакатонов
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl sm:text-3xl font-bold text-red">0</span>
              <span className="text-[0.625rem] sm:text-[0.6875rem] uppercase tracking-wide text-text-accent">
                Ср. балл
              </span>
            </div>
          </div>
        )}

        <div className="flex w-full justify-end">
          <button
            type="button"
            onClick={onEditClick}
            className="flex cursor-pointer items-center gap-1.5 rounded-md bg-input-background px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-xs text-text-accent hover:text-text"
          >
            <Pencil className="size-3 sm:size-3.5" />
            Редактировать
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
