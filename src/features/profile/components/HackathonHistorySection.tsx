import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HackathonDetailRead } from "@/features/hackathons/model/hackathonTypes";

interface HackathonHistorySectionProps {
  history: HackathonDetailRead[] | null;
  onDetailsClick: (hackathon: HackathonDetailRead) => void;
}

// function formatMonthYear(dateString: string) {
//   const formatted = new Date(dateString).toLocaleDateString("ru-RU", {
//     month: "long",
//     year: "numeric",
//   });
//   return formatted.charAt(0).toUpperCase() + formatted.slice(1);
// }

// function formatPosition(position?: number) {
//   if (!position) return null;
//   if (position === 1) return "1-е место";
//   if (position === 2) return "2-е место";
//   if (position === 3) return "3-е место";
//   if (position <= 10) return "Топ-10";
//   return `${position}-е место`;
// }

function getResultDotColor(position?: number) {
  if (position === 1) return "bg-yellow";
  if (position === 2) return "bg-[#A8A8A8]";
  return "bg-text-accent";
}

export default function HackathonHistorySection({
  history,
  onDetailsClick,
}: HackathonHistorySectionProps) {
  if (!history || history.length === 0) {
    return (
      <section className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <Activity
            className="h-5 w-5 sm:h-6 sm:w-6 text-red"
            strokeWidth={2.25}
          />
          <h3 className="text-xl sm:text-2xl text-text">История участия</h3>
        </div>
        <div className="text-xs sm:text-sm text-text-accent">
          Нет истории участия
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2 sm:gap-2.5">
        <Activity
          className="h-5 w-5 sm:h-6 sm:w-6 text-red"
          strokeWidth={2.25}
        />
        <h3 className="text-xl sm:text-2xl text-text">История участия</h3>
      </div>

      <div className="relative pl-4 sm:pl-6">
        <div className="absolute top-2 bottom-2 left-1.25 sm:left-1.75 w-px bg-red/40" />

        <div className="space-y-3 sm:space-y-4">
          {history.map((event, index) => {
            return (
              <div key={event.id} className="relative">
                <span
                  className={cn(
                    "absolute top-4 sm:top-5 -left-4 sm:-left-6 h-3 sm:h-3.5 w-3 sm:w-3.5 rounded-full border-2 border-card-background",
                    index === 0 ? "bg-red" : "bg-text-accent",
                  )}
                />

                <div className="rounded-lg border border-border bg-card-background p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4">
                    <h4 className="text-sm sm:text-base font-bold text-text">
                      {event.title}
                    </h4>
                    <span className="shrink-0 text-xs sm:text-sm text-text-accent">
                      Июнь 2026
                    </span>
                  </div>

                  <p className="mt-1 text-xs sm:text-sm text-text-accent">
                    Команда HackPrimeTeam
                  </p>

                  <div className="mt-1.5 sm:mt-2 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-red">
                    <span
                      className={cn(
                        "h-1.5 sm:h-2 w-1.5 sm:w-2 shrink-0 rounded-full",
                        getResultDotColor(2),
                      )}
                    />
                    <span>* 8.9 баллов</span>
                  </div>

                  <div className="mt-2 sm:mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => onDetailsClick(event)}
                      className="cursor-pointer text-xs sm:text-sm text-red hover:opacity-80"
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
