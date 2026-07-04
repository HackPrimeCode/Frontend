import { Outlet } from "react-router";
import Header from "./Header";
import HeroStats from "../HeroStats";
import { useGetHackathonsQuery } from "@/features/hackathons/api/hackathonApi";
import { useMemo } from "react";
import { formatTotalRewards } from "@/lib/utils";
import { useCountdown } from "@/lib/hooks/useCountdown";

export default function AuthLayout() {
  const { data: hackathons = [], isLoading, error } = useGetHackathonsQuery();

  const timerTarget = useMemo(() => {
    const active = hackathons.find((h) => h.status === "IN_PROGRESS");
    if (active) {
      return {
        title: active.title,
        date: active.end_date,
        label: "ДО ОКОНЧАНИЯ",
      };
    }

    const upcoming = hackathons.find((h) => h.status === "REGISTRATION");
    if (upcoming) {
      return {
        title: upcoming.title,
        date: upcoming.start_date,
        label: "ДО НАЧАЛА",
      };
    }

    return null;
  }, [hackathons]);

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

  const { days, hours, minutes, seconds } = useCountdown(timerTarget?.date);

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
      <main className="relative flex-1 flex flex-col lg:grid lg:grid-cols-2 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-0">
        <div className="flex justify-center w-full pt-8 lg:pt-15 pb-8 lg:pb-10 order-1 lg:order-2">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>

        <div className="w-full lg:w-px h-px lg:h-full my-6 lg:my-0 bg-linear-to-r lg:bg-linear-to-t from-transparent via-red/30 to-transparent order-2 pointer-events-none relative lg:absolute lg:left-1/2 lg:top-0 lg:bottom-0 lg:-translate-x-1/2"></div>

        <section className="w-full px-4 sm:px-12 pt-4 lg:pt-15 pb-10 flex flex-col items-center order-3 lg:order-1">
          <div className="w-full max-w-4xl flex flex-col items-center text-center">
            <img
              src="/HackPrimeCode-logo.svg"
              alt="logo"
              className="w-16 lg:w-24 h-14 lg:h-20 mb-4 lg:mb-7"
            />
            <h1 className="text-3xl lg:text-5xl text-white mb-2 lg:mb-4">
              Hack
              <span className="text-red">
                {" "}
                Prime
                <br className="hidden lg:block" /> Code
              </span>
            </h1>
            <p className="text-lg lg:text-3xl text-white mb-6 lg:mb-10">
              Code. Compete. Conquer.
            </p>

            <div className="w-full h-px bg-linear-to-r from-transparent via-red/20 to-transparent mb-6 lg:mb-8" />

            {timerTarget && (
              <div className="w-full flex flex-col items-center mb-6 lg:mb-5">
                <div className="flex gap-2.5 mb-3 lg:mb-4">
                  <div className="h-3 w-3 rounded-full bg-red translate-y-0.5"></div>
                  <span className="text-xs lg:text-sm text-text-accent uppercase">
                    {timerTarget.title} * {timerTarget.label}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-5">
                  {timeBlocks.map((block, index) => (
                    <div key={index} className="flex gap-1.5 sm:gap-5">
                      <div>
                        <p className="text-red text-2xl lg:text-4xl font-bold">
                          {block.value}
                        </p>
                        <p className="text-text-accent text-[10px] lg:text-xs uppercase mt-0.5">
                          {block.label}
                        </p>
                      </div>

                      {index < timeBlocks.length - 1 && (
                        <span className="text-red text-2xl lg:text-4xl font-bold select-none">
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
      </main>
    </div>
  );
}
