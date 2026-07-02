import type { HackathonDetailRead } from "@/features/hackathons/model/hackathonTypes";
import { calculateDurationHours, formatDate } from "@/lib/utils";
import { Calendar, CircleCheck, Clock, MapPin } from "lucide-react";

function HackathonCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative pl-6">
      <div className="rounded-lg border border-border bg-card-background p-4">
        {children}
      </div>
    </div>
  );
}

interface CurrentHackathonSectionProps {
  hackathon: HackathonDetailRead | null | undefined;
  isLoading: boolean;
  onDetailsClick: (hackathon: HackathonDetailRead) => void;
}

export default function CurrentHackathonSection({
  hackathon,
  isLoading,
  onDetailsClick,
}: CurrentHackathonSectionProps) {
  const durationHours = calculateDurationHours(
    hackathon?.start_date,
    hackathon?.end_date,
  );

  if (isLoading) {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <CircleCheck className="h-6 w-6 text-red" strokeWidth={2.25} />
          <h3 className="text-2xl text-text">Текущее мероприятие</h3>
        </div>
        <HackathonCard>
          <div className="animate-pulse text-text-accent">Загрузка...</div>
        </HackathonCard>
      </section>
    );
  }

  if (!hackathon) {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <CircleCheck className="h-6 w-6 text-red" strokeWidth={2.25} />
          <h3 className="text-2xl text-text">Текущее мероприятие</h3>
        </div>
        <HackathonCard>
          <div className="text-sm text-text-accent">
            Вы не участвуете ни в одном мероприятии
          </div>
        </HackathonCard>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2.5">
        <CircleCheck className="h-6 w-6 text-red" strokeWidth={2.25} />
        <h3 className="text-2xl text-text">Текущее мероприятие</h3>
      </div>

      <HackathonCard>
        <div className="space-y-4">
          <div>
            <h4 className="text-base font-bold text-text">{hackathon.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-text-accent">
              {hackathon.description}
            </p>
          </div>

          {hackathon.topics && hackathon.topics.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {hackathon.topics.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-input-background px-2.5 py-1 text-xs text-text-accent"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-end justify-between gap-4 pt-1">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-accent">
              <span className="flex items-center gap-2">
                <Calendar className="size-4 text-red" />
                {formatDate(hackathon?.start_date)} -{" "}
                {formatDate(hackathon?.end_date)}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="size-4 text-red" />
                {hackathon.event_location}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="size-4 text-red" />
                {durationHours} часов
              </span>
            </div>

            <button
              type="button"
              onClick={() => onDetailsClick(hackathon)}
              className="cursor-pointer text-sm text-red hover:opacity-80"
            >
              Подробнее &gt;
            </button>
          </div>
        </div>
      </HackathonCard>
    </section>
  );
}
