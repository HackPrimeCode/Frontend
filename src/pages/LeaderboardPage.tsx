import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Award, ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SortKey = "total" | "idea" | "implementation" | "quality" | "design";

interface LeaderboardEntry {
  id: number;
  teamName: string;
  teamInitial: string;
  teamColor: string;
  total: number;
  idea: number;
  implementation: number;
  quality: number;
  design: number;
}

const PAGE_SIZE = 8;

const sortOptions: { id: SortKey; label: string }[] = [
  { id: "total", label: "Итог" },
  { id: "idea", label: "Идея" },
  { id: "implementation", label: "Реализация" },
  { id: "quality", label: "Качество кода" },
  { id: "design", label: "Дизайн" },
];

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

const teamNames = [
  "ZeroDay",
  "ByteForce",
  "Null Pointer",
  "CoolStack",
  "DataFlow",
  "CloudNine",
  "PixelForge",
  "CodeStorm",
  "NeuralNet",
  "StackOverflow",
  "GitPush",
  "DevOps Pro",
  "ReactRacers",
  "Pythonistas",
  "GoGophers",
  "Rustaceans",
  "TypeScripters",
  "FullStackers",
  "BugHunters",
  "API Masters",
  "DockerWhale",
  "K8s Crew",
  "Lambda Squad",
  "MicroServices",
  "GraphQL Gang",
  "Redis Rebels",
  "MongoDB Mafia",
  "Postgres Pros",
  "SwiftSquad",
  "KotlinKrew",
  "FlutterForce",
  "VueVanguard",
  "AngularArmy",
  "SvelteSquad",
  "NextNavigators",
  "TailwindTeam",
  "WebpackWizards",
  "ViteVelocity",
  "JestJugglers",
  "CypressCrew",
];

function randomScore() {
  return Number((Math.random() * 3 + 7).toFixed(1));
}

function createMockEntries(count: number): LeaderboardEntry[] {
  return Array.from({ length: count }, (_, index) => {
    const name = teamNames[index % teamNames.length];

    const suffix =
      index >= teamNames.length
        ? ` ${Math.floor(index / teamNames.length) + 1}`
        : "";

    const teamName = `${name}${suffix}`;

    const idea = randomScore();
    const implementation = randomScore();
    const quality = randomScore();
    const design = randomScore();

    const total = Number(
      ((idea + implementation + quality + design) / 4).toFixed(1),
    );

    return {
      id: index + 1,
      teamName,
      teamInitial: teamName[0]?.toUpperCase() ?? "?",
      teamColor: teamPalette[index % teamPalette.length],
      total,
      idea,
      implementation,
      quality,
      design,
    };
  });
}

const allMockEntries = createMockEntries(100);

function PlaceBadge({ place }: { place: number }) {
  if (place === 1) {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow text-[0.625rem] font-bold text-background">
        1
      </span>
    );
  }

  if (place === 2) {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#A8A8A8] text-[0.625rem] font-bold text-background">
        2
      </span>
    );
  }

  if (place === 3) {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#CD7F32] text-[0.625rem] font-bold text-background">
        3
      </span>
    );
  }

  return <span className="text-sm text-text-accent">#{place}</span>;
}

function TeamAvatar({
  initial,
  color,
}: {
  initial: string;
  color: string;
}) {
  return (
    <span
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-text"
      style={{ backgroundColor: color }}
    >
      {initial}
    </span>
  );
}

export default function LeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSort, setActiveSort] = useState<SortKey>("total");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const sortedEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = allMockEntries.filter((entry) =>
      entry.teamName.toLowerCase().includes(query),
    );

    return [...filtered].sort((a, b) => {
      const diff = b[activeSort] - a[activeSort];

      if (diff !== 0) return diff;

      return a.teamName.localeCompare(b.teamName, "ru");
    });
  }, [searchQuery, activeSort]);

  const visibleEntries = useMemo(
    () => sortedEntries.slice(0, visibleCount),
    [sortedEntries, visibleCount],
  );

  const hasMore = visibleCount < sortedEntries.length;

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);

    setTimeout(() => {
      setVisibleCount((prev) =>
        Math.min(prev + PAGE_SIZE, sortedEntries.length),
      );

      setIsLoadingMore(false);
    }, 300);
  }, [hasMore, isLoadingMore, sortedEntries.length]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, activeSort]);

  useEffect(() => {
    const sentinel = loadMoreRef.current;
    const root = scrollContainerRef.current;

    if (!sentinel || !root || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      {
        root,
        rootMargin: "120px",
      },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <div className="min-h-[calc(100vh-3.75rem)] w-full bg-background px-6 py-5">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6">
        <div className="flex items-center gap-2.5">
          <Award className="h-6 w-6 text-red" strokeWidth={2.25} />
          <h1 className="text-2xl text-text">Лидерборд</h1>
        </div>

        <div className="flex items-end justify-between gap-6">
          <div className="flex w-full max-w-[420px] flex-col gap-2">
            <span className="text-[0.6875rem] uppercase tracking-wide text-text-accent">
              Выберите мероприятие
            </span>

            <div className="relative">
              <select
                defaultValue="hackprime-summer-2026"
                className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-border bg-input-background px-4 pr-10 text-sm text-text outline-none"
              >
                <option value="hackprime-summer-2026">
                  HackPrimeCode Лето 2026
                </option>
              </select>

              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-text-accent" />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-input-background px-3 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red" />
              </span>

              <span className="text-xs text-text-accent">
                Обновляется в реальном времени
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-red bg-red/6 px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-red" />
              <span className="text-xs text-red">Активный</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-6">
          <div className="relative w-full max-w-[280px]">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-text-accent" />

            <Input
              type="text"
              placeholder="Поиск команды..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-9.5 w-full rounded-lg border-border bg-input-background pr-4 pl-10 text-sm text-text placeholder:text-text-accent"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[0.6875rem] uppercase tracking-wide text-text-accent">
              Сортировка:
            </span>

            <div className="flex items-center gap-2">
              {sortOptions.map((option) => {
                const isActive = activeSort === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setActiveSort(option.id)}
                    className={cn(
                      "h-8 cursor-pointer rounded-lg border px-3 text-xs whitespace-nowrap transition-all duration-150",
                      isActive
                        ? "border-red bg-red text-text shadow-lg shadow-red/10"
                        : "border-border bg-input-background/40 text-text-accent hover:border-text-accent/40 hover:text-text",
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="max-h-[550px] overflow-y-auto rounded-lg border border-border bg-card-background"
        >
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="w-[100px] px-5 py-4 text-left text-[0.6875rem] font-normal uppercase text-text-accent">
                  Место
                </th>

                <th className="w-[220px] px-5 py-4 text-left text-[0.6875rem] font-normal uppercase text-text-accent">
                  Команда
                </th>

                <th className="w-[180px] px-5 py-4 text-left text-[0.6875rem] font-normal uppercase text-text-accent">
                  Баллы
                </th>

                <th className="w-[180px] px-5 py-4 text-left text-[0.6875rem] font-normal uppercase text-text-accent">
                  Идея
                </th>

                <th className="w-[180px] px-5 py-4 text-left text-[0.6875rem] font-normal uppercase text-text-accent">
                  Реализ.
                </th>

                <th className="w-[180px] px-5 py-4 text-left text-[0.6875rem] font-normal uppercase text-text-accent">
                  Качество
                </th>

                <th className="px-5 py-4 text-left text-[0.6875rem] font-normal uppercase text-text-accent">
                  Дизайн
                </th>
              </tr>
            </thead>

            <tbody>
              {visibleEntries.map((entry, index) => {
                const place = index + 1;

                return (
                  <tr
                    key={entry.id}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-5 py-4">
                      <PlaceBadge place={place} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <TeamAvatar
                          initial={entry.teamInitial}
                          color={entry.teamColor}
                        />

                        <span className="truncate text-sm text-text">
                          {entry.teamName}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm font-bold text-red">
                      {entry.total.toFixed(1)}
                    </td>

                    <td className="px-5 py-4 text-sm text-text-accent">
                      {entry.idea.toFixed(1)}
                    </td>

                    <td className="px-5 py-4 text-sm text-text-accent">
                      {entry.implementation.toFixed(1)}
                    </td>

                    <td className="px-5 py-4 text-sm text-text-accent">
                      {entry.quality.toFixed(1)}
                    </td>

                    <td className="px-5 py-4 text-sm text-text-accent">
                      {entry.design.toFixed(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {hasMore && (
            <div
              ref={loadMoreRef}
              className="flex h-14 items-center justify-center border-t border-border text-xs text-text-accent"
            >
              {isLoadingMore ? "Загрузка..." : ""}
            </div>
          )}

          {visibleEntries.length === 0 && (
            <div className="flex h-40 items-center justify-center text-sm text-text-accent">
              Команды не найдены
            </div>
          )}
        </div>
      </div>
    </div>
  );
}