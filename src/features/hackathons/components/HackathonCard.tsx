import { Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HackathonPublicRead } from "../model/hackathonTypes";
import {
  calculateDurationHours,
  formatDate,
  formatTotalRewards,
  statusConfig,
} from "@/lib/utils";

interface HackathonCardProps {
  hackathon: HackathonPublicRead;
  onNavigateToDetails?: (id: number) => void;
}

export default function HackathonCard({
  hackathon,
  onNavigateToDetails,
}: HackathonCardProps) {
  const durationHours = calculateDurationHours(
    hackathon.start_date,
    hackathon.end_date,
  );

  const participantPercent =
    (hackathon.total_participants / hackathon.max_participants) * 100;

  const currentStatus = statusConfig[hackathon.status] || {
    text: hackathon.status,
    styles: "bg-text-accent/10 text-text-accent border-border",
    dotColor: "bg-text-accent",
  };

  return (
    <div className="flex flex-col justify-between gap-2 w-full max-w-88 min-h-70 bg-card-background border border-border rounded-sm px-5 py-3">
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div
            className={`flex justify-center items-center gap-2 text-xs border px-3 py-1.5 rounded-lg ${currentStatus.styles}`}
          >
            <div
              className={`h-3 w-3 rounded-full ${currentStatus.dotColor}`}
            ></div>
            <span>{currentStatus.text}</span>
          </div>
          <span className="text-red text-lg">
            {formatTotalRewards(
              hackathon.prizes
                .map((prize) => Number(prize.reward))
                .reduce((acc, curVal) => acc + curVal),
            )}
          </span>
        </div>

        <div className="mb-3">
          <h3 className="text-lg text-white mb-1.5 line-clamp-2">
            {hackathon.title}
          </h3>
          <p className="text-xs text-text-accent line-clamp-3">
            {hackathon.description ||
              "Описание мероприятия организаторами пока не заполнено"}
          </p>
        </div>

        <div className="w-full grid grid-cols-[auto_auto_4rem] gap-2 items-center justify-between">
          <div className="flex items-center gap-1 text-text-accent">
            <Calendar className="w-3 h-3 text-red translate-y-[-0.5px]" />
            <div>
              <p className="text-[0.6875rem]">
                {formatDate(hackathon.start_date)} —{" "}
                {formatDate(hackathon.end_date)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-text-accent">
            <MapPin className="w-3 h-3 text-red translate-y-[-0.5px]" />
            <span className="text-[0.6875rem]">{hackathon.event_location}</span>
          </div>
          {durationHours && (
            <div className="flex items-center gap-1 text-text-accent">
              <Clock className="w-3 h-3 text-red translate-y-[-0.5px]" />
              <span className="text-[0.6875rem]">{durationHours}ч.</span>
            </div>
          )}
        </div>
        <div className="w-full flex items-center justify-start py-2.5 gap-1 border-b border-border">
          {hackathon.topics.map((topic: string) => (
            <div className="bg-card-background border border-border px-2 py-1 text-text-accent text-[0.6875rem] rounded-sm">
              {topic}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between items-center text-[0.6875rem]">
          <span className="text-text-accent">
            {hackathon.total_participants} / {hackathon.max_participants}{" "}
            участников
          </span>
          <span className="text-red">{Math.ceil(participantPercent)} %</span>
        </div>
        <progress
          value={participantPercent}
          max="100"
          className="w-full h-1 appearance-none rounded-full overflow-hidden
             [&::-webkit-progress-bar]:bg-border 
             [&::-webkit-progress-value]:bg-red"
        />
      </div>

      <div className="flex items-center justify-between w-full mt-1">
        <div className="text-xs text-text-accent">
          {hackathon.total_teams} команд
        </div>

        <Button
          onClick={() => onNavigateToDetails?.(hackathon.id)}
          className="h-5 px-1 text-red hover:text-red/85 text-xs cursor-pointer flex items-center justify-center gap-2 hover:animate-pulse"
        >
          <span>Подробнее</span>
          <img src="/dropdown-active-icon.svg" alt="" className="w-2.5 h-1.5" />
        </Button>
      </div>
    </div>
  );
}
