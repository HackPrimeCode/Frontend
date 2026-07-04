import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useGetHackathonsQuery } from "@/features/hackathons/api/hackathonApi";
import DeadlineTimer from "@/components/DeadlineTimer";
import HackathonCard from "@/features/hackathons/components/HackathonCard";
import type { HackathonDetailRead } from "@/features/hackathons/model/hackathonTypes";
import { formatTotalRewards } from "@/lib/utils";
import HackathonDetailsModal from "@/features/hackathons/components/HackathonDetailsModal";
import { useNavigate } from "react-router";
import { useAuth } from "@/lib/hooks/useAuth";

type FilterStatus = "ALL" | "REGISTRATION" | "IN_PROGRESS" | "FINISHED";

const filters = [
  { id: "ALL", label: "Все" },
  { id: "IN_PROGRESS", label: "Активные" },
  { id: "REGISTRATION", label: "Предстоящие" },
  { id: "FINISHED", label: "Завершенные" },
];

export default function HubPage() {
  const { data: hackathons = [], isLoading, error } = useGetHackathonsQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("ALL");
  const [visibleCount, setVisibleCount] = useState(12);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHackathon, setSelectedHackathon] =
    useState<HackathonDetailRead | null>(null);

  const handleOpenDetails = (hackathon: HackathonDetailRead) => {
    setSelectedHackathon(hackathon);
    setIsModalOpen(true);
  };

  const filteredHackathons = useMemo(() => {
    return hackathons.filter((hack) => {
      const matchesSearch =
        hack.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (hack.description &&
          hack.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        activeFilter === "ALL" || hack.status === activeFilter;

      return matchesSearch && matchesStatus;
    });
  }, [hackathons, searchQuery, activeFilter]);

  const slicedHackathons = useMemo(() => {
    return filteredHackathons.slice(0, visibleCount);
  }, [filteredHackathons, visibleCount]);

  const nearestActiveHackathon = useMemo(() => {
    const activeHacks = hackathons.filter(
      (h) => h.status === "IN_PROGRESS" && h.end_date,
    );
    if (activeHacks.length === 0) return null;
    return activeHacks.sort(
      (a, b) =>
        new Date(a.end_date!).getTime() - new Date(b.end_date!).getTime(),
    )[0];
  }, [hackathons]);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleFilterChange = (status: FilterStatus) => {
    setActiveFilter(status);
    setVisibleCount(12);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setVisibleCount(12);
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-3.75rem)] w-full text-white">
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

  let activeCount = 0;
  let upcomingCount = 0;
  let totalParticipants = 0;
  let totalRewardSum = 0;

  for (const hackathon of hackathons) {
    if (hackathon.status === "IN_PROGRESS") activeCount++;
    else if (hackathon.status === "REGISTRATION") upcomingCount++;

    totalParticipants += hackathon.total_participants || 0;

    if (hackathon.prizes) {
      for (const prize of hackathon.prizes) {
        totalRewardSum += Number(prize.reward) || 0;
      }
    }
  }

  const stats = [
    {
      label: "Активных",
      value: activeCount,
      icon: "/stats-active-hacks-icon.svg",
    },
    {
      label: "Предстоящих",
      value: upcomingCount,
      icon: "/stats-registration-hacks-icon.svg",
    },
    {
      label: "Участников",
      value: totalParticipants,
      icon: "/stats-total-participants-icon.svg",
    },
    {
      label: "Призов всего",
      value: formatTotalRewards(totalRewardSum),
      icon: "/stats-total-prizes-icon.svg",
    },
  ];

  return (
    <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-[16rem_1px_1fr] min-h-[calc(100vh-3.75rem)] bg-background">
      <div className="p-4 sm:p-5 flex flex-col items-center space-y-5 order-2 lg:order-1 border-t lg:border-t-0 border-border">
        <div className="flex w-full flex-col gap-3">
          <h2 className="uppercase text-text-accent text-xs">// Статистика</h2>
          <div className="grid grid-cols-2 lg:flex lg:flex-col gap-2.5">
            {stats.map((stat) => (
              <div
                className="bg-input-background border-[1.5px] lg:border-2 border-border flex items-center gap-2.5 sm:gap-3 rounded-lg px-2.5 py-3"
                key={stat.label}
              >
                <div className="flex items-center justify-center w-6.5 h-6.5 bg-red/14 rounded-sm shrink-0">
                  <img src={stat.icon} alt="" className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <p className="text-[10px] sm:text-[0.6875rem] text-text-accent uppercase truncate">
                    {stat.label}
                  </p>
                  <p className="text-sm sm:text-base text-white truncate">
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-[#AC302C]/25 hidden lg:block"></div>

        <div className="w-full sm:w-fit lg:w-full flex flex-col gap-2 sm:min-w-60">
          <span className="text-xs text-text-accent uppercase">
            Ближайший дедлайн
          </span>
          {nearestActiveHackathon ? (
            <div className="relative overflow-hidden w-full bg-input-background border border-red rounded-lg p-3 flex flex-col gap-1">
              <h4 className="text-[0.6875rem] text-text-accent truncate">
                {nearestActiveHackathon.title}
              </h4>
              <div>
                <DeadlineTimer targetDate={nearestActiveHackathon.end_date} />
              </div>
            </div>
          ) : (
            <div className="text-xs text-red text-center py-6 border border-red rounded-lg bg-input-background w-full">
              Нет активных дедлайнов
            </div>
          )}
        </div>
      </div>

      <div className="bg-border h-px w-full lg:h-full lg:w-px order-2"></div>

      <main className="w-full flex flex-col px-4 sm:px-6 py-5 order-1 lg:order-3">
        <div>
          <h2 className="text-xl sm:text-2xl text-white mb-0.5">
            Все мероприятия
          </h2>
          <span className="text-xs text-text-accent">
            // Выбери мероприятие и подай заявку
          </span>
        </div>

        <div className="w-full flex flex-col lg:flex-row gap-3 mt-6 mb-5">
          <div className="w-full max-w-2xl lg:max-w-full relative flex items-center group">
            <Search className="absolute left-3 w-4 h-4 text-text-accent" />
            <Input
              type="text"
              placeholder="Поиск по названию, тегу или городу..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="h-9.5 w-full bg-input-background border-border text-sm text-white pl-11 pr-4 rounded-sm outline-none placeholder-text-accent focus-visible:border-red"
            />
          </div>

          <div className="w-full lg:w-auto grid grid-cols-2 sm:flex gap-2 items-center">
            {filters.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleFilterChange(tab.id as FilterStatus)}
                  className={`flex items-center justify-center gap-2 h-8 px-3.5 rounded-lg text-xs border transition-all duration-150 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-red text-white border-red shadow-lg shadow-red/10"
                      : "bg-input-background/40 text-text-accent border-border hover:border-text-accent/40 hover:text-white"
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1">
          {slicedHackathons.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 justify-items-center">
                {slicedHackathons.map((hackathon) => (
                  <HackathonCard
                    key={hackathon.id}
                    hackathon={hackathon}
                    onNavigateToDetails={() => handleOpenDetails(hackathon)}
                  />
                ))}
              </div>

              {visibleCount < filteredHackathons.length && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 12)}
                    className="h-10 px-6 bg-input-background border border-border text-white text-xs rounded-sm hover:border-red/50 active:bg-input-background/80 transition-all duration-150 cursor-pointer"
                  >
                    Показать еще
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="h-60 flex flex-col items-center justify-center">
              <p className="text-sm text-text-accent">
                // По вашему запросу ничего не найдено
              </p>
            </div>
          )}
        </div>
      </main>

      <HackathonDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        hackathon={selectedHackathon}
        onApply={handleApply}
      />
    </div>
  );
}
