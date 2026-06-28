import { Calendar, CircleCheck, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { CurrentHackathon } from "../model/profileTypes";

interface CurrentHackathonSectionProps {
  hackathon: CurrentHackathon | null | undefined;
  isLoading: boolean;
  onDetailsClick: (hackathon: CurrentHackathon) => void;
}

export default function CurrentHackathonSection({
  hackathon,
  isLoading,
  onDetailsClick,
}: CurrentHackathonSectionProps) {
  if (isLoading) {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <CircleCheck className="h-6 w-6 text-red" strokeWidth={2.25} />
          <h3 className="text-2xl text-text">Текущее мероприятие</h3>
        </div>
        <Card className="border border-border bg-card-background ring-0">
          <CardContent className="py-6">
            <div className="animate-pulse text-text-accent">Загрузка...</div>
          </CardContent>
        </Card>
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
        <Card className="border border-border bg-card-background ring-0">
          <CardContent className="py-6 text-sm text-text-accent">
            Вы не участвуете ни в одном мероприятии
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2.5">
        <CircleCheck className="h-6 w-6 text-red" strokeWidth={2.25} />
        <h3 className="text-2xl text-text">Текущее мероприятие</h3>
      </div>

      <Card className="border border-border bg-card-background ring-0">
        <CardContent className="space-y-4 py-5">
          <div>
            <h4 className="text-base font-bold text-text">{hackathon.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-text-accent">
              {hackathon.description}
            </p>
          </div>

          {hackathon.skills && hackathon.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {hackathon.skills.map((skill) => (
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
                {hackathon.date}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="size-4 text-red" />
                {hackathon.location}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="size-4 text-red" />
                {hackathon.duration_hours} часов
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
        </CardContent>
      </Card>
    </section>
  );
}
