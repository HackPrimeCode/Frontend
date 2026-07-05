import {
  X,
  Calendar,
  MapPin,
  Users,
  Cpu,
  Mail,
  Award,
  Lightbulb,
  Code2,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { useEffect } from "react";
import type { HackathonDetailRead } from "../model/hackathonTypes";
import {
  calculateDurationHours,
  formatDate,
  formatTotalRewards,
  statusConfig,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { selectCurrentContext } from "@/features/auth/model/authSlice";
import { useSelector } from "react-redux";

interface HackathonDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hackathon: HackathonDetailRead | null;
  onApply?: (hackathonId: number) => void;
}

const getPrizeIcon = (title: string) => {
  const lowerTitle = title.toLowerCase();

  if (
    lowerTitle.includes("идея") ||
    lowerTitle.includes("креатив") ||
    lowerTitle.includes("концепт")
  ) {
    return <Lightbulb className="w-5 h-5 text-[#eab308]" />;
  }
  if (
    lowerTitle.includes("чист") ||
    lowerTitle.includes("код") ||
    lowerTitle.includes("архитектур")
  ) {
    return <Code2 className="w-5 h-5 text-[#3b82f6]" />;
  }
  if (lowerTitle.includes("безопасн") || lowerTitle.includes("кибер")) {
    return <ShieldAlert className="w-5 h-5 text-[#ef4444]" />;
  }
  if (
    lowerTitle.includes("ai") ||
    lowerTitle.includes("ии") ||
    lowerTitle.includes("нейро")
  ) {
    return <Cpu className="w-5 h-5 text-[#a855f7]" />;
  }
  if (lowerTitle.includes("лучш") || lowerTitle.includes("гранд")) {
    return <Sparkles className="w-5 h-5 text-[#10b981]" />;
  }

  return <Award className="w-5 h-5 text-red" />;
};

export default function HackathonDetailsModal({
  isOpen,
  onClose,
  hackathon,
  onApply,
}: HackathonDetailsModalProps) {
  const authContext = useSelector(selectCurrentContext);
  const isParticipant = authContext?.teamId !== null;
  console.log(authContext!);
  console.count("HackathonDetailsModal render");
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !hackathon) return null;

  const currentStatus = statusConfig[hackathon.status] || {
    text: hackathon.status,
    styles: "bg-text-accent/10 text-text-accent border-border",
    dotColor: "bg-text-accent",
  };

  const durationHours = calculateDurationHours(
    hackathon.start_date,
    hackathon.end_date,
  );

  const participantPercent =
    (hackathon.current_participants / hackathon.max_participants) * 100;

  const hasPrizes = hackathon?.prizes && hackathon.prizes.length > 0;
  const hasTopics = hackathon?.topics && hackathon.topics.length > 0;
  const hasRequirements =
    hackathon?.submission_requirements &&
    hackathon.submission_requirements.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative w-full max-w-160 h-full max-h-[90vh] border-2 border-border rounded-lg flex flex-col overflow-hidden text-white animate-in fade-in zoom-in-95 duration-150">
        <Button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 text-text-accent hover:text-white transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="flex-1 min-h-0 bg-input-background overflow-y-auto custom-scrollbar flex flex-col">
          <div className="flex flex-col gap-2 bg-card-background px-4 py-4 sm:px-7 sm:pt-5.5 sm:pb-4 border-b-2 border-border shrink-0">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex justify-center items-center gap-2 text-[10px] sm:text-xs border px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg ${currentStatus.styles}`}
                >
                  <div
                    className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full ${currentStatus.dotColor}`}
                  ></div>
                  <span>{currentStatus.text}</span>
                </div>
                <span className="hidden sm:inline text-xs text-text-accent">
                  {hackathon.event_location} * {durationHours}ч.
                </span>
              </div>

              <div className="flex flex-col items-end pr-8">
                <span className="hidden sm:inline text-[0.6875rem] text-text-accent uppercase">
                  призовой фонд
                </span>
                <span className="text-xl sm:text-2xl text-red">
                  {formatTotalRewards(
                    hackathon.prizes
                      .map((prize) => +prize.reward)
                      .reduce((acc, curVal) => acc + curVal, 0),
                  )}
                </span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl tracking-wide mt-1 sm:mt-0">
              {hackathon.title}
            </h2>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] sm:text-xs text-text-accent pt-0.5">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-red translate-y-[-0.5px]" />
                <div>
                  <p className="text-[10px] sm:text-[0.6875rem]">
                    {formatDate(hackathon.start_date)} —{" "}
                    {formatDate(hackathon.end_date)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red" />
                <span>{hackathon.event_location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red" />
                <span>
                  {hackathon.current_participants} /{" "}
                  {hackathon.max_participants} участников
                </span>
              </div>
            </div>

            <div className="w-full flex items-center gap-3 sm:gap-4 mt-1.5">
              <progress
                value={participantPercent}
                max="100"
                className="w-full h-1.5 appearance-none rounded-full overflow-hidden
             [&::-webkit-progress-bar]:bg-border 
             [&::-webkit-progress-value]:bg-red"
              />
              <span className="text-[10px] sm:text-[0.6875rem] text-text-accent whitespace-nowrap">
                {Math.ceil(participantPercent)}% заполнено
              </span>
            </div>
          </div>

          <div className="flex flex-col space-y-4 px-4 py-4 sm:px-7">
            <div className="flex flex-col gap-1.5">
              <h4 className="text-[10px] sm:text-[0.6875rem] text-text-accent uppercase tracking-widest">
                о мероприятии
              </h4>
              <p className="text-xs sm:text-[0.8125rem] text-[#d1d1d6] leading-relaxed tracking-wide">
                {hackathon.description}
              </p>
            </div>

            {hasPrizes && (
              <div className="flex flex-col gap-2.5">
                <h4 className="text-[10px] sm:text-[0.6875rem] text-text-accent uppercase tracking-widest">
                  Призы
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {hackathon.prizes.map((prize) => (
                    <div
                      key={prize.id}
                      className="flex items-center gap-3.5 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-card-background border-2 border-border rounded-lg"
                    >
                      {getPrizeIcon(prize.title)}
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-xs sm:text-sm tracking-wide text-white truncate">
                          {formatTotalRewards(+prize.reward)}
                        </span>
                        <span className="text-[10px] sm:text-[0.6875rem] text-text-accent leading-tight mt-0.5 line-clamp-2">
                          {prize.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hasRequirements && (
              <div className="flex flex-col gap-2.5">
                <h4 className="text-[10px] sm:text-[0.6875rem] text-text-accent uppercase tracking-widest">
                  требования
                </h4>
                <ul className="flex flex-col gap-1.5 text-xs sm:text-[0.8125rem] text-[#e5e5ea]">
                  {hackathon.submission_requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red mt-1.5 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {hasTopics && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {hackathon.topics.map((tag, idx) => (
                  <span
                    key={idx}
                    className="h-5.5 px-2.5 bg-input-background border border-border/70 rounded-sm text-[10px] sm:text-[0.6875rem] text-text-accent flex items-center tracking-wide"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-full min-h-16 sm:h-18 px-4 py-3 sm:py-0 sm:px-7 bg-background border-t-2 border-border flex flex-col sm:flex-row gap-3 sm:gap-0 items-center justify-between shrink-0">
          <div className="text-xs sm:text-sm text-[#e5e5ea] tracking-wide text-center sm:text-left">
            <span className="text-white">{hackathon.current_teams}</span> команд
            зарегистрировано
          </div>
          {hackathon.status === "FINISHED" ? (
            <span>Хакатон завершен </span>
          ) : isParticipant ? (
            <span>Вы уже участвуете в хакатоне</span>
          ) : (
            <Button
              onClick={() => {
                if (hackathon && onApply) {
                  onApply(hackathon.id);
                  onClose();
                }
              }}
              disabled={!onApply}
              className="w-full sm:w-auto h-9 px-5 sm:px-6 bg-red text-white text-xs rounded-lg flex items-center justify-center gap-2 hover:bg-red/90 transition-colors cursor-pointer tracking-wider"
            >
              <Mail className="w-4 h-4" />
              Принять участие
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
