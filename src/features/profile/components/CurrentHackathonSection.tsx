import type { HackathonDetailRead } from "@/features/hackathons/model/hackathonTypes";
import { calculateDurationHours, formatDate } from "@/lib/utils";
import { Calendar, CircleCheck, Clock, MapPin } from "lucide-react";

function HackathonCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative pl-4 sm:pl-6">
      <div className="rounded-lg border border-border bg-card-background p-3 sm:p-4">
        {children}
      </div>
    </div>
  );
}

interface CurrentHackathonSectionProps {
  hackathon: HackathonDetailRead | null | undefined;
  onDetailsClick: (hackathon: HackathonDetailRead) => void;
}

export default function CurrentHackathonSection({
  hackathon,
  onDetailsClick,
}: CurrentHackathonSectionProps) {
  const durationHours = calculateDurationHours(
    hackathon?.start_date,
    hackathon?.end_date,
  );

  if (!hackathon) {
    return (
      <section className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <CircleCheck
            className="h-5 w-5 sm:h-6 sm:w-6 text-red"
            strokeWidth={2.25}
          />
          <h3 className="text-xl sm:text-2xl text-text">Текущее мероприятие</h3>
        </div>
        <HackathonCard>
          <div className="text-xs sm:text-sm text-text-accent">
            Вы не участвуете ни в одном мероприятии
          </div>
        </HackathonCard>
      </section>
    );
  }

  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2 sm:gap-2.5">
        <CircleCheck
          className="h-5 w-5 sm:h-6 sm:w-6 text-red"
          strokeWidth={2.25}
        />
        <h3 className="text-xl sm:text-2xl text-text">Текущее мероприятие</h3>
      </div>

      <HackathonCard>
        <div className="space-y-3 sm:space-y-4">
          <div>
            <h4 className="text-sm sm:text-base font-bold text-text">
              {hackathon.title}
            </h4>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed text-text-accent">
              {hackathon.description}
            </p>
          </div>

          {hackathon.topics && hackathon.topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {hackathon.topics.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-input-background px-2 sm:px-2.5 py-0.75 sm:py-1 text-[10px] sm:text-xs text-text-accent"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-4 pt-1">
            <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-5 gap-y-1.5 sm:gap-y-2 text-xs sm:text-sm text-text-accent">
              <span className="flex items-center gap-1.5 sm:gap-2">
                <Calendar className="size-3.5 sm:size-4 text-red" />
                <div>
                  <p className="text-[0.6875rem]">
                    {formatDate(hackathon.start_date)} —{" "}
                    {formatDate(hackathon.end_date)}
                  </p>
                </div>
              </span>
              <span className="flex items-center gap-1.5 sm:gap-2">
                <MapPin className="size-3.5 sm:size-4 text-red" />
                {hackathon.event_location}
              </span>
              <span className="flex items-center gap-1.5 sm:gap-2">
                <Clock className="size-3.5 sm:size-4 text-red" />
                {durationHours} часов
              </span>
            </div>

            <button
              type="button"
              onClick={() => onDetailsClick(hackathon)}
              className="cursor-pointer text-xs sm:text-sm text-red hover:opacity-80"
            >
              Подробнее &gt;
            </button>
          </div>
        </div>
      </HackathonCard>
    </section>
  );
}
