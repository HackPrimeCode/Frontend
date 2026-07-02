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
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((s) => {
          const Icon = s.icon as any;
          return (
            <div key={s.title} className="rounded-lg border border-border bg-card-background p-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-text-accent">{s.title}</div>
                <Icon className="w-5 h-5 text-red" />
              </div>
              <div className="text-2xl text-white mt-3 font-bold">{s.value}</div>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border border-border bg-card-background p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h3 className="text-base text-white">Все команды</h3>
          <div className="relative w-full max-w-[320px]">
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

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left align-middle">
            <thead>
              <tr className="text-white">
                <th className="w-[150px] py-4 px-4">Команда</th>
                <th className="w-[150px] py-4 px-4">Капитан</th>
                <th className="w-[150px] py-4 px-4">Участников</th>
                <th className="w-[150px] py-4 px-4">Сдача</th>
                <th
                  className="w-[150px] py-4 px-4 cursor-pointer select-none"
                  onClick={() => setSortDirection((current) => (current === "desc" ? "asc" : "desc"))}
                >
                  <div className="flex items-center gap-2 text-white">
                    Оценка
                    <span className="text-text-accent text-xs">{sortDirection === "desc" ? "↓" : "↑"}</span>
                  </div>
                </th>
                <th className="w-[150px] py-4 px-4">Действие</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams.map((t) => (
                <tr key={t.name} className="border-t border-border">
                  <td className="py-4 px-4 text-white">
                    <div className="flex items-center gap-3">
                      <TeamAvatar name={t.name} />
                      <span>{t.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-text-accent">{t.captain}</td>
                  <td className="py-4 px-4 text-text-accent">{t.members}</td>
                  <td className="py-4 px-4">
                    <span className="inline-block bg-emerald-500/10 text-emerald-400 text-xs px-2 py-1 rounded">Сдан</span>
                  </td>
                  <td className="py-4 px-4 text-red font-bold">{t.score}</td>
                  <td className="py-4 px-4 text-text-accent">
                    <button className="px-3 py-1 rounded bg-input-background text-xs">Профиль</button>
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
