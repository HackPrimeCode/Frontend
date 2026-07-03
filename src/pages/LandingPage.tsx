import { useState, useMemo } from "react";
import { useGetHackathonsQuery } from "@/features/hackathons/api/hackathonApi";
import HackathonCard from "@/features/hackathons/components/HackathonCard";
import HeroStats from "@/components/HeroStats";
import Footer from "@/components/layout/Footer";
import HackathonDetailsModal from "@/features/hackathons/components/HackathonDetailsModal";
import { formatTotalRewards } from "@/lib/utils";
import type { HackathonDetailRead } from "@/features/hackathons/model/hackathonTypes";
import { useCountdown } from "@/lib/hooks/useCountdown";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useAuth } from "@/lib/hooks/useAuth";

type FilterStatus = "ALL" | "REGISTRATION" | "IN_PROGRESS" | "FINISHED";

const filters: { id: FilterStatus; label: string }[] = [
  { id: "ALL", label: "Все" },
  { id: "IN_PROGRESS", label: "Активные" },
  { id: "REGISTRATION", label: "Предстоящие" },
  { id: "FINISHED", label: "Завершённые" },
];

export default function LandingPage() {
  const { data: hackathons = [], isLoading, error } = useGetHackathonsQuery();
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHackathon, setSelectedHackathon] =
    useState<HackathonDetailRead | null>(null);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const activeHackathon = useMemo(
    () => hackathons.find((h) => h.status === "IN_PROGRESS"),
    [hackathons],
  );

  const filteredHackathons = useMemo(() => {
    if (activeFilter === "ALL") return hackathons;
    return hackathons.filter((h) => h.status === activeFilter);
  }, [hackathons, activeFilter]);

  const stats = useMemo(() => {
    const totalParticipants = hackathons.reduce(
      (acc, h) => acc + h.total_participants,
      0,
    );
    const totalTeams = hackathons.reduce((acc, h) => acc + h.total_teams, 0);
    const finishedCount = hackathons.filter(
      (h) => h.status === "FINISHED",
    ).length;
    const totalPrizes = hackathons.reduce((acc, h) => {
      return acc + h.prizes.reduce((sum, p) => sum + Number(p.reward), 0);
    }, 0);

    return [
      { value: totalParticipants, label: "Участников" },
      { value: totalTeams, label: "Команд" },
      { value: finishedCount, label: "Мероприятий проведено" },
      { value: formatTotalRewards(totalPrizes), label: "Выдано призов" },
    ];
  }, [hackathons]);

  const { days, hours, minutes, seconds } = useCountdown(
    activeHackathon?.end_date,
  );

  const handleApply = (hackathonId: number) => {
    if (isAuthenticated) {
      navigate("/team", { state: { applyHackathonId: hackathonId } });
    } else {
      navigate("/login", {
        state: {
          from: "/team",
          applyHackathonId: hackathonId,
        },
      });
    }
  };

  const timeBlocks = [
    { value: days, label: "Дни" },
    { value: hours, label: "Час" },
    { value: minutes, label: "Мин" },
    { value: seconds, label: "Сек" },
  ];

  const handleOpenDetails = (hackathon: HackathonDetailRead) => {
    setSelectedHackathon(hackathon);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full text-white">
        <span className="animate-pulse text-sm">Загрузка...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-3.75rem)] w-full px-6">
        <div className="text-red text-sm border border-red/20 bg-red/5 px-5 py-4 rounded-lg max-w-md text-center">
          Ошибка при загрузке данных. Проверьте соединение с сервером
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-3.75rem)] bg-background">
      <section className="w-full px-6 sm:px-10 md:px-18 lg:px-36 pt-10 md:pt-16 pb-12 md:pb-17 flex flex-col items-center">
        <div className="w-full max-w-4xl flex flex-col items-center text-center">
          <h1 className="text-4xl sm:text-6xl md:text-[5.25rem] text-white mb-3 md:mb-4">
            Hack<span className="text-red">Prime</span>Code
          </h1>
          <p className="text-lg sm:text-2xl md:text-3xl text-white mb-6 md:mb-9">
            Code. Compete. Conquer.
          </p>
          <p className="text-sm sm:text-base text-text-accent max-w-2xl">
            HackPrimeCode - платформа для организации и участия в хакатонах
            нового поколения. Находи команду, решай реальные задачи бизнеса и
            выигрывай крупные призы вместе с лучшими разработчиками страны.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 my-6 md:my-10 w-full sm:w-auto">
            {activeHackathon && (
              <Button
                onClick={() => handleApply(activeHackathon.id)}
                className="h-11 px-6 bg-red text-white text-sm rounded-lg flex items-center justify-center gap-2 hover:bg-red/90 transition-colors cursor-pointer w-full sm:w-auto"
              >
                <img
                  src="/flag-icon.svg"
                  alt=""
                  className="w-4 h-4 translate-y-px"
                />
                Принять участие
              </Button>
            )}
            <Button
              onClick={() => navigate("/hub", { replace: true })}
              className="h-11 px-6 bg-transparent border-[0.5px] border-text-accent text-white text-sm rounded-lg flex items-center justify-center gap-2 hover:border-text-accent/50 transition-colors cursor-pointer w-full sm:w-auto"
            >
              Все мероприятия
              <img
                src="/arrow-white-icon.svg"
                alt=""
                className="w-3 h-3 translate-y-px"
              />
            </Button>
          </div>

          {activeHackathon && (
            <div className="w-full flex flex-col items-center mb-6 md:mb-9">
              <div className="flex gap-2.5 mb-3 md:mb-4">
                <div className="h-3 w-3 rounded-full bg-red translate-y-0.5"></div>
                <span className="text-xs sm:text-sm text-text-accent uppercase">
                  {activeHackathon.title} * ДО ОКОНЧАНИЯ
                </span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-5">
                {timeBlocks.map((block, index) => (
                  <div key={index} className="flex gap-1.5 sm:gap-5">
                    <div className="text-center">
                      <p className="text-red text-2xl sm:text-4xl font-bold">
                        {block.value}
                      </p>
                      <p className="text-text-accent text-[10px] sm:text-xs uppercase mt-0.5">
                        {block.label}
                      </p>
                    </div>

                    {index < timeBlocks.length - 1 && (
                      <span className="text-red text-2xl sm:text-4xl font-bold select-none">
                        :
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="w-full">
            <HeroStats stats={stats} />
          </div>
        </div>
      </section>

      <section className="w-full px-4 sm:px-6 pb-12">
        <div className="w-full max-w-6xl mx-auto flex flex-col space-y-6 md:space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="text-center md:text-left">
              <h2 className="text-xl sm:text-[1.375rem] text-white mb-1">
                Мероприятия платформы
              </h2>
              <p className="text-xs text-text-accent">
                Выбери мероприятие и подай заявку онлайн
              </p>
            </div>

            <div className="grid grid-cols-2 sm:flex gap-1.5 bg-input-background border border-border rounded-lg p-1 w-full sm:w-auto max-w-md sm:max-w-none mx-auto md:mx-0">
              {filters.map((filter) => (
                <Button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-3 py-2 sm:px-4 text-xs rounded-md transition-all cursor-pointer w-full sm:w-auto text-center whitespace-nowrap ${
                    activeFilter === filter.id
                      ? "bg-red text-white"
                      : "text-text-accent hover:text-white"
                  }`}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="w-full h-px bg-linear-to-r from-transparent via-red/40 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center">
            {filteredHackathons.map((hackathon) => (
              <HackathonCard
                key={hackathon.id}
                hackathon={hackathon}
                onNavigateToDetails={() => handleOpenDetails(hackathon)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="w-full px-4 sm:px-6 pb-8.5 border-b border-border">
        <div className="w-full max-w-6xl mx-auto bg-card-background border border-border rounded-lg px-5 sm:px-7 md:px-9 py-4 md:py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="w-full sm:max-w-md md:max-w-none">
            <h3 className="text-white text-sm md:text-lg font-medium">
              Готов принять участие?
            </h3>
            <p className="hidden sm:block text-xs md:text-sm text-text-accent mt-1 md:mt-2">
              // Посмотри список мероприятий и выбери то, что тебе интересно
            </p>
          </div>

          <Button
            onClick={() => navigate("/hub", { replace: true })}
            className="h-10 md:h-12 px-4 md:px-6 bg-red text-white text-xs md:text-sm rounded-lg flex items-center justify-center gap-2 hover:bg-red/90 transition-colors cursor-pointer whitespace-nowrap w-full sm:w-auto shrink-0"
          >
            Все мероприятия
            <img
              src="/arrow-white-icon.svg"
              alt=""
              className="w-3 h-3 translate-y-px"
            />
          </Button>
        </div>
      </section>

      <Footer />

      <HackathonDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        hackathon={selectedHackathon}
        onApply={handleApply}
      />
    </div>
  );
}
