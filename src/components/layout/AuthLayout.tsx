import { Outlet } from "react-router";
import Header from "./Header";
import HeroStats from "../HeroStats";
import { useGetHackathonsQuery } from "@/features/hackathons/api/hackathonApi";
import { useMemo } from "react";
import { formatTotalRewards } from "@/lib/utils";
import { useCountdown } from "@/lib/hooks/useCountdown";

export default function AuthLayout() {
  const { data: hackathons = [], isLoading, error } = useGetHackathonsQuery();
  const activeHackathon = useMemo(
    () => hackathons.find((h) => h.status === "IN_PROGRESS"),
    [hackathons],
  );
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
  const timeBlocks = [
    { value: days, label: "Дни" },
    { value: hours, label: "Час" },
    { value: minutes, label: "Мин" },
    { value: seconds, label: "Сек" },
  ];

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
    <div className="min-h-screen w-full bg-background flex flex-col">
      <Header />
      <main className="relative flex-1 grid grid-cols-2 max-w-360 w-full mx-auto">
        <section className="w-full px-24 pt-15 flex flex-col items-center">
          <div className="w-full max-w-4xl flex flex-col items-center text-center">
            <img
              src="/HackPrimeCode-logo.svg"
              alt="logo"
              className="w-24 h-20 mb-7"
            />
            <h1 className="text-4xl md:text-5xl text-white mb-4">
              Hack
              <span className="text-red">
                Prime
                <br />
                Code
              </span>
            </h1>
            <p className="text-xl md:text-3xl text-white mb-10">
              Code. Compete. Conquer.
            </p>

            <div className="w-full h-px bg-linear-to-r from-transparent via-red/20 to-transparent mb-8" />

            {activeHackathon && (
              <div className="w-full flex flex-col items-center mb-5">
                <div className="flex gap-2.5 mb-4">
                  <div className="h-3 w-3 rounded-full bg-red translate-y-0.5"></div>
                  <span className="text-sm text-text-accent uppercase">
                    {activeHackathon.title} * ДО ОКОНЧАНИЯ
                  </span>
                </div>
                <div className="flex items-center gap-5">
                  {timeBlocks.map((block, index) => (
                    <div key={index} className="flex gap-5">
                      <div>
                        <p className="text-red text-4xl">{block.value}</p>
                        <p className="text-text-accent text-xs uppercase">
                          {block.label}
                        </p>
                      </div>

                      {index < timeBlocks.length - 1 && (
                        <span className="text-red text-4xl">:</span>
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
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 bg-linear-to-t from-transparent via-red/30 to-transparent w-px"></div>
        <div className="flex justify-center w-full pt-15">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
