import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HackathonParticipation } from "../model/profileTypes";

interface HackathonHistorySectionProps {
  history: HackathonParticipation[] | undefined;
  isLoading: boolean;
  onDetailsClick: (hackathon: HackathonParticipation) => void;
}

function formatMonthYear(dateString: string) {
  const formatted = new Date(dateString).toLocaleDateString("ru-RU", {
    month: "long",
    year: "numeric",
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function formatPosition(position?: number) {
  if (!position) return null;
  if (position === 1) return "1-е место";
  if (position === 2) return "2-е место";
  if (position === 3) return "3-е место";
  if (position <= 10) return "Топ-10";
  return `${position}-е место`;
}

function getResultDotColor(position?: number) {
  if (position === 1) return "bg-yellow";
  if (position === 2) return "bg-[#A8A8A8]";
  return "bg-text-accent";
}

export default function HackathonHistorySection({
  history,
  isLoading,
  onDetailsClick,
}: HackathonHistorySectionProps) {
  if (isLoading) {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <Activity className="h-6 w-6 text-red" strokeWidth={2.25} />
          <h3 className="text-2xl text-text">История участия</h3>
        </div>
        <div className="animate-pulse text-text-accent">Загрузка...</div>
      </section>
    );
  }

  if (!history || history.length === 0) {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <Activity className="h-6 w-6 text-red" strokeWidth={2.25} />
          <h3 className="text-2xl text-text">История участия</h3>
        </div>
        <div className="text-sm text-text-accent">Нет истории участия</div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2.5">
        <Activity className="h-6 w-6 text-red" strokeWidth={2.25} />
        <h3 className="text-2xl text-text">История участия</h3>
      </div>

      <div className="relative pl-6">
        <div className="absolute top-2 bottom-2 left-[7px] w-px bg-red/40" />

        <div className="space-y-4">
          {history.map((event, index) => {
            const roleLabel =
              event.role === "captain" ? "Капитан" : "Участник";
            const positionLabel = formatPosition(event.position);

            return (
              <div key={event.id} className="relative">
                <span
                  className={cn(
                    "absolute top-5 -left-6 h-3.5 w-3.5 rounded-full border-2 border-card-background",
                    index === 0 ? "bg-red" : "bg-text-accent",
                  )}
                />

                <div className="rounded-lg border border-border bg-card-background p-4">
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="text-base font-bold text-text">
                      {event.title}
                    </h4>
                    {event.date && (
                      <span className="shrink-0 text-sm text-text-accent">
                        {formatMonthYear(event.date)}
                      </span>
                    )}
                  </div>

                  {event.team_name && (
                    <p className="mt-1 text-sm text-text-accent">
                      {roleLabel} • {event.team_name}
                    </p>
                  )}

                  {positionLabel && event.score !== undefined && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-red">
                      <span
                        className={cn(
                          "h-2 w-2 shrink-0 rounded-full",
                          getResultDotColor(event.position),
                        )}
                      />
                      <span>
                        {positionLabel} • {event.score.toFixed(1)} баллов
                      </span>
                    </div>
                  )}

                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => onDetailsClick(event)}
                      className="cursor-pointer text-sm text-red hover:opacity-80"
                    >
                      Подробнее &gt;
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
