import { useMemo, useState } from "react";
import { Search, Users, Layers, UploadCloud, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useGetOrganizerHackathonDetailsQuery } from "@/features/organizer/api";

const teamPalette = [
  "#C71C25",
  "#7B5EA7",
  "#E07A3A",
  "#3D9A6A",
  "#3B82F6",
  "#EC4899",
  "#14B8A6",
  "#F59E0B",
];

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function getColorForName(name: string) {
  const sum = name.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  return teamPalette[sum % teamPalette.length];
}

function TeamAvatar({ name }: { name: string }) {
  const initials = getInitials(name);
  const color = getColorForName(name);

  return (
    <span
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-text"
      style={{ backgroundColor: color }}
    >
      {initials}
    </span>
  );
}

interface OverviewTabProps {
  hackathonId: number | null;
}

export default function OverviewTab({ hackathonId }: OverviewTabProps) {
  const [searchValue, setSearchValue] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const { data: hackathonData, isLoading } = useGetOrganizerHackathonDetailsQuery(hackathonId ?? 0, {
    skip: !hackathonId,
  });

  const stats = [
    { title: "ЗАРЕГИСТРИРОВАНО", value: hackathonData?.total_participants || 0, icon: Users },
    { title: "КОМАНД СОЗДАНО", value: hackathonData?.total_teams || 0, icon: Layers },
    { title: "ПРОЕКТОВ СДАНО", value: 0, icon: UploadCloud },
    { title: "СРЕДНИЙ БАЛЛ", value: "0", icon: Star },
  ];

  const teams = hackathonData?.teams || [];

  const filteredTeams = useMemo(() => {
    const normalized = searchValue.trim().toLowerCase();
    return teams
      .filter((team) =>
        team.name.toLowerCase().includes(normalized),
      )
      .sort((a, b) => (sortDirection === "asc" ? a.members_count - b.members_count : b.members_count - a.members_count));
  }, [searchValue, sortDirection, teams]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-accent">Загрузка...</div>
      </div>
    );
  }

  if (!hackathonId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-accent">Выберите хакатон</div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {stats.map((s) => {
          const Icon = s.icon as any;
          return (
            <div key={s.title} className="rounded-lg border border-border bg-card-background p-3 md:p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs text-text-accent">{s.title}</div>
                <Icon className="w-4 md:w-5 h-4 md:h-5 text-red flex-shrink-0" />
              </div>
              <div className="text-xl md:text-2xl text-white mt-3 font-bold">{s.value}</div>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border border-border bg-card-background p-3 md:p-4 overflow-hidden flex flex-col">
        <div className="flex flex-col gap-3 md:gap-4 sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6">
          <h3 className="text-base text-white">Все команды</h3>
          <div className="relative w-full sm:max-w-[320px]">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-text-accent" />
            <Input
              type="text"
              placeholder="Поиск команды..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-input-background pl-10 pr-4 text-sm text-white placeholder:text-text-accent"
            />
          </div>
        </div>

        <div className="w-full overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[600px] text-sm text-left align-middle whitespace-nowrap">
            <thead>
              <tr className="text-white border-b border-border">
                <th className="px-3 md:px-4 py-3 md:py-4 text-xs md:text-sm">Команда</th>
                <th
                  className="px-3 md:px-4 py-3 md:py-4 text-xs md:text-sm cursor-pointer select-none"
                  onClick={() => setSortDirection((current) => (current === "desc" ? "asc" : "desc"))}
                >
                  <div className="flex items-center gap-2 text-white">
                    <span>Участников</span>
                    <span className="text-text-accent text-xs">{sortDirection === "desc" ? "↓" : "↑"}</span>
                  </div>
                </th>
                <th className="px-3 md:px-4 py-3 md:py-4 text-xs md:text-sm">Действие</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0 hover:bg-input-background/30 transition-colors">
                  <td className="px-3 md:px-4 py-3 md:py-4 text-white">
                    <div className="flex items-center gap-2 md:gap-3">
                      <TeamAvatar name={t.name} />
                      <span className="text-xs md:text-sm">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-3 md:px-4 py-3 md:py-4 text-text-accent text-xs md:text-sm">{t.members_count}</td>
                  <td className="px-3 md:px-4 py-3 md:py-4 text-text-accent">
                    <button className="px-3 py-1 rounded bg-input-background text-xs hover:bg-input-background/80 transition-colors">Профиль</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
