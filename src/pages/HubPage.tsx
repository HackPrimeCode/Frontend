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

  const stats = [
    {
      label: "Активных",
      value: hackathons.filter(
        (hackathon) => hackathon.status === "IN_PROGRESS",
      ).length,
      icon: "/stats-active-hacks-icon.svg",
    },
    {
      label: "Предстоящих",
      value: hackathons.filter(
        (hackathon) => hackathon.status === "REGISTRATION",
      ).length,
      icon: "/stats-registration-hacks-icon.svg",
    },
    {
      label: "Участников",
      value: hackathons
        .map((hackathon) => {
          return hackathon.total_participants;
        })
        .reduce((acc, curVal) => acc + curVal, 0),
      icon: "/stats-total-participants-icon.svg",
    },
    {
      label: "Призов всего",
      value: formatTotalRewards(
        hackathons.reduce((total, hackathon) => {
          const hackathonSum = (hackathon.prizes || []).reduce(
            (sum, prize) => sum + (+prize.reward || 0),
            0,
          );
          return total + hackathonSum;
        }, 0),
      ),
      icon: "/stats-total-prizes-icon.svg",
    },
  ];

  return (
    <div className="w-full mx-auto grid grid-cols-[16rem_1px_1fr] min-h-[calc(100vh-3.75rem)] bg-background">
      <div className="p-5 flex flex-col items-center space-y-5">
        <div className="flex w-full flex-col gap-3">
          <h2 className="uppercase text-text-accent text-xs">// Статистика</h2>
          <div className="flex flex-col gap-2.5 ">
            {stats.map((stat) => (
              <div
                className="bg-input-background border-2 border-border flex items-center gap-3 rounded-lg px-2.5 py-3"
                key={stat.label}
              >
                <div className="flex items-center justify-center w-6.5 h-6.5 bg-red/14 rounded-sm">
                  <img src={stat.icon} alt="" className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[0.6875rem] text-text-accent uppercase">
                    {stat.label}
                  </p>
                  <p className="text-white">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-95/100 h-px bg-[#AC302C]/25 px-4"></div>
        <div className="w-full flex flex-col gap-2">
          <span className="text-xs text-text-accent uppercase">
            Ближайший дедлайн
          </span>
          {nearestActiveHackathon ? (
            <div className="relative overflow-hidden w-full bg-input-background border border-red rounded-lg p-3 flex flex-col gap-1">
              <h4 className="text-[0.6875rem] text-text-accent truncate">
                {nearestActiveHackathon.title}
              </h4>

              <div className="">
                <DeadlineTimer targetDate={nearestActiveHackathon.end_date} />
              </div>
            </div>
          ) : (
            <div className="text-xs text-red text-center py-6 border border-red rounded-lg bg-input-background">
              Нет активных дедлайнов
            </div>
          )}
        </div>
      </div>
      <div className="bg-border w-px"></div>
      <main className="w-full flex flex-col px-6 py-5">
        <div>
          <h2 className="text-2xl text-white mb-0.5">Все мероприятия</h2>
          <span className="text-xs text-text-accent">
            // Выбери мероприятие и подай заявку
          </span>
        </div>
        <div className="w-full grid grid-cols-[1fr_auto] gap-3 mt-6 mb-4.5">
          <div className="w-full relative flex items-center group">
            <Search className="absolute left-3 w-4 h-4 text-text-accent" />
            <Input
              type="text"
              placeholder="Поиск по названию, тегу или городу..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="h-9.5 w-full bg-input-background border-border text-sm text-white pl-11 pr-4 rounded-sm outline-none placeholder-text-accent"
            />
          </div>

          <div className="w-full flex gap-3 items-center">
            {filters.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleFilterChange(tab.id as FilterStatus)}
                  className={`flex items-center gap-3 w-full h-8 px-3 rounded-lg text-xs  border transition-all duration-150 cursor-pointer ${
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
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
                    className="h-10 px-6 bg-input-background border border-border text-white text-xs  rounded-sm hover:border-red/50 active:bg-input-background/80 transition-all duration-150 cursor-pointer"
                  >
                    Показать еще
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center">
              <p className="text-sm text-text-accent">
                По вашему запросу ничего не найдено
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
