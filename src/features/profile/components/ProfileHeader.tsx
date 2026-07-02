import { Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { User } from "@/features/auth/model/authTypes";

interface ProfileHeaderProps {
  profile: User | undefined;
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

  const initials = (profile.name || "User")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // СЧИТАЕМ СТАТИСТИКУ НА ЛЕТУ ИЗ МАССИВА УЧАСТИЙ 🚀
  // Пока бэк не возвращает это поле, будет пустой массив (везде отобразятся 0)
  const participations = profile.hackathon_participations ?? [];
  const totalHackathons = participations.length;

  const scores = participations
    .filter((h) => h.score !== undefined)
    .map((h) => h.score!);
  const averageScore = scores.length
    ? scores.reduce((a, b) => a + b, 0) / scores.length
    : 0;

  return (
    <Card className="border border-border bg-card-background ring-0">
      <CardContent className="flex flex-col items-center gap-4 pt-6">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-red text-2xl font-bold text-white">
          {initials}
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold text-text">
            {profile.name ?? "Не указано"}
          </h2>
          <p className="text-sm text-text-accent">{profile.email}</p>
          {roleLabel && (
            <span className="mt-1 inline-block rounded bg-red/10 px-2 py-0.5 text-xs text-red">
              {roleLabel}
            </span>
          )}
        </div>

        {/* Заменяем profile.skills на твой profile.tech_stack */}
        {showSkills && profile.tech_stack && profile.tech_stack.length > 0 && (
          <div className="w-full border-t border-border pt-4">
            <p className="mb-2 text-[0.6875rem] uppercase tracking-wide text-text-accent">
              Стек технологий
            </p>
            <div className="flex flex-wrap gap-1.5">
              {profile.tech_stack.map((skill) => (
                <span
                  key={skill}
                  className="rounded bg-input-background px-2 py-1 text-xs text-text"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {showStats && (
          <div className="grid w-full grid-cols-2 gap-2 border-t border-border pt-6 text-center">
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl font-bold text-red">
                {totalHackathons}
              </span>
              <span className="text-[0.6875rem] uppercase tracking-wide text-text-accent">
                Хакатонов
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl font-bold text-red">
                {averageScore.toFixed(1)}
              </span>
              <span className="text-[0.6875rem] uppercase tracking-wide text-text-accent">
                Ср. балл
              </span>
            </div>
          </div>
        )}

        <div className="flex w-full justify-end">
          <button
            type="button"
            onClick={onEditClick}
            className="flex cursor-pointer items-center gap-1.5 rounded-md bg-input-background px-3 py-1.5 text-xs text-text-accent hover:text-text"
          >
            <Pencil className="size-3.5" />
            <span>Редактировать</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
