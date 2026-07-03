import { useMemo, useState } from "react";
import { Search, Users, Layers, UploadCloud, Star } from "lucide-react";
import { Input } from "@/components/ui/input";

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

export default function OverviewTab() {
  const [searchValue, setSearchValue] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const stats = [
    { title: "ЗАРЕГИСТРИРОВАНО", value: 847, icon: Users },
    { title: "КОМАНД СОЗДАНО", value: 142, icon: Layers },
    { title: "ПРОЕКТОВ СДАНО", value: 136, icon: UploadCloud },
    { title: "СРЕДНИЙ БАЛЛ", value: "7.9", icon: Star },
  ];

  const teams = [
    { name: "ByteForce", captain: "А.Иванов", members: 3, score: 8.9 },
    { name: "Null Pointer", captain: "Д.Волков", members: 4, score: 8.5 },
    { name: "Zero Day", captain: "М.Андреев", members: 3, score: 9.4 },
    { name: "404 Team", captain: "В.Морозов", members: 2, score: 7.2 },
  ];

  const filteredTeams = useMemo(() => {
    const normalized = searchValue.trim().toLowerCase();
    return teams
      .filter((team) =>
        team.name.toLowerCase().includes(normalized) ||
        team.captain.toLowerCase().includes(normalized),
      )
      .sort((a, b) => (sortDirection === "asc" ? a.score - b.score : b.score - a.score));
  }, [searchValue, sortDirection]);

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

        <div className="overflow-x-auto -mx-3 -mb-3 md:-mx-4 md:-mb-4">
          <table className="w-full text-sm text-left align-middle">
            <thead>
              <tr className="text-white">
                <th className="px-3 md:px-4 py-3 md:py-4 text-xs md:text-sm">Команда</th>
                <th className="px-3 md:px-4 py-3 md:py-4 text-xs md:text-sm hidden sm:table-cell">Капитан</th>
                <th className="px-3 md:px-4 py-3 md:py-4 text-xs md:text-sm hidden md:table-cell">Участников</th>
                <th className="px-3 md:px-4 py-3 md:py-4 text-xs md:text-sm hidden lg:table-cell">Сдача</th>
                <th
                  className="px-3 md:px-4 py-3 md:py-4 text-xs md:text-sm cursor-pointer select-none"
                  onClick={() => setSortDirection((current) => (current === "desc" ? "asc" : "desc"))}
                >
                  <div className="flex items-center gap-2 text-white">
                    <span className="hidden sm:inline">Оценка</span>
                    <span className="sm:hidden">О.</span>
                    <span className="text-text-accent text-xs">{sortDirection === "desc" ? "↓" : "↑"}</span>
                  </div>
                </th>
                <th className="px-3 md:px-4 py-3 md:py-4 text-xs md:text-sm hidden lg:table-cell">Действие</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams.map((t) => (
                <tr key={t.name} className="border-t border-border hover:bg-input-background/30 transition-colors">
                  <td className="px-3 md:px-4 py-3 md:py-4 text-white">
                    <div className="flex items-center gap-2 md:gap-3">
                      <TeamAvatar name={t.name} />
                      <span className="text-xs md:text-sm">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-3 md:px-4 py-3 md:py-4 text-text-accent text-xs md:text-sm hidden sm:table-cell">{t.captain}</td>
                  <td className="px-3 md:px-4 py-3 md:py-4 text-text-accent text-xs md:text-sm hidden md:table-cell">{t.members}</td>
                  <td className="px-3 md:px-4 py-3 md:py-4 hidden lg:table-cell">
                    <span className="inline-block bg-emerald-500/10 text-emerald-400 text-xs px-2 py-1 rounded">Сдан</span>
                  </td>
                  <td className="px-3 md:px-4 py-3 md:py-4 text-red font-bold text-xs md:text-sm">{t.score}</td>
                  <td className="px-3 md:px-4 py-3 md:py-4 text-text-accent hidden lg:table-cell">
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
