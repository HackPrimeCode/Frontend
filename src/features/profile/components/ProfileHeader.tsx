import { Link, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { UserProfile } from "../model/profileTypes";

interface ProfileHeaderProps {
  profile: UserProfile | undefined;
  isLoading: boolean;
  onEditClick: () => void;
  showSkills?: boolean;
  showStats?: boolean;
  roleLabel?: string;
}

export default function ProfileHeader({
  profile,
  isLoading,
  onEditClick,
  showSkills = true,
  showStats = true,
  roleLabel,
}: ProfileHeaderProps) {
  if (isLoading) {
    return (
      <Card className="border border-border bg-card-background ring-0">
        <CardContent className="pt-6">
          <div className="animate-pulse text-text-accent">Загрузка...</div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="border border-border bg-card-background ring-0">
        <CardContent className="pt-6 text-text-accent">
          Ошибка загрузки профиля
        </CardContent>
      </Card>
    );
  }

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 1);

  return (
    <Card className="border border-border bg-card-background ring-0">
      <CardContent className="flex flex-col items-center gap-4 sm:gap-5 pt-6 sm:pt-8 pb-4 sm:pb-6">
        <div className="flex h-20 w-20 sm:h-28 sm:w-28 items-center justify-center rounded-full border-2 border-red bg-red text-3xl sm:text-5xl font-bold text-text shadow-[0_0_0_4px_rgba(199,28,37,0.25)]">
          {initials}
        </div>

        <div className="text-center">
          <h2 className="text-lg sm:text-xl font-bold text-text">{profile.name}</h2>
          <p className="mt-1 text-xs sm:text-sm text-text-accent">{profile.email}</p>
          {roleLabel && (
            <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-medium uppercase tracking-wide text-red">
              {roleLabel}
            </p>
          )}
        </div>

        {profile.github_url && (
          <a
            href={profile.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs sm:text-sm text-text-accent hover:text-text"
          >
            <Link className="size-3.5 sm:size-4 shrink-0" />
            <span className="truncate max-w-[200px] sm:max-w-none">{profile.github_url}</span>
          </a>
        )}

        {showSkills && profile.skills && profile.skills.length > 0 && (
          <div className="w-full">
            <p className="mb-2 sm:mb-2.5 text-[0.625rem] sm:text-[0.6875rem] uppercase tracking-wide text-text-accent">
              Навыки
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {profile.skills.map((skill) => (
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
                {profile.stats.total_hackathons}
              </span>
              <span className="text-[0.625rem] sm:text-[0.6875rem] uppercase tracking-wide text-text-accent">
                Хакатонов
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl sm:text-3xl font-bold text-red">
                {profile.stats.average_score.toFixed(1)}
              </span>
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
