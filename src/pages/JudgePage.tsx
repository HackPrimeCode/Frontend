import { useState } from "react";
import { FileCheck, FileText, Users, ChevronDown } from "lucide-react";
import { mockHackathon } from "@/features/tasks/components/TaskTab/TaskTab";
import TaskSpecTab from "@/features/tasks/components/TaskTab/tabs/TaskSpecTab";
import EvaluationTab from "@/features/judge/components/EvaluationTab";

type MainTab = "spec" | "teams_review";

interface ParticipantTeam {
  id: number;
  name: string;
  status: "submitted" | "pending" | "checked";
  members_count: number;
}

const mockTeams: ParticipantTeam[] = [
  { id: 1, name: "ByteForce", status: "submitted", members_count: 4 },
  { id: 2, name: "DevsOfFuture", status: "checked", members_count: 3 },
  { id: 3, name: "CodeMasters", status: "pending", members_count: 4 },
  { id: 4, name: "AI_Visionaries", status: "submitted", members_count: 2 },
];

export default function JudgePage() {
  const [activeMainTab, setActiveMainTab] = useState<MainTab>("spec");
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="w-full mx-auto min-h-[calc(100vh-3.75rem)] flex flex-col lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="flex flex-col border-b lg:border-b-0 lg:border-r border-border bg-background lg:bg-transparent">
        <div className="w-full border-b border-border p-4 md:p-5 flex items-center justify-between lg:block">
          <div className="truncate max-w-[70%] lg:max-w-full">
            <span className="text-[10px] text-red uppercase font-semibold block mb-1 tracking-wider">
              Панель Жюри
            </span>
            <h2 className="text-white text-sm font-medium truncate">
              {mockHackathon.title}
            </h2>
          </div>

          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex lg:hidden items-center gap-1.5 px-3 py-1.5 bg-card-background border border-border rounded text-xs text-white cursor-pointer"
          >
            <span>Команды ({mockTeams.length})</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-text-accent transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <div
          className={`${isDropdownOpen ? "flex" : "hidden"} lg:flex flex-col flex-1 max-h-64 lg:max-h-none overflow-y-auto py-2 lg:py-6 bg-background lg:bg-transparent z-40 border-b border-border lg:border-b-0`}
        >
          <div>
            <span className="text-xs text-text-accent uppercase hidden lg:block px-2 mb-6">
              // Проекты ({mockTeams.length})
            </span>
            <div className="flex flex-col">
              {mockTeams.map((team, i) => {
                const isSelected = selectedTeamId === team.id;
                return (
                  <button
                    key={team.id}
                    onClick={() => {
                      setSelectedTeamId(team.id);
                      setActiveMainTab("teams_review");
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left p-3.5 border-y border-border flex items-center justify-between gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-text-accent/10"
                        : "hover:bg-text-accent/5"
                    }`}
                  >
                    <div className="flex gap-2.5">
                      <div className="w-7.5 h-7.5 flex p-2 bg-text-accent/10 rounded-sm border border-border items-center justify-center text-white/60 text-xs">
                        <span>#{i + 1}</span>
                      </div>

                      <div className="flex flex-col items-start">
                        <span className="text-xs text-white truncate max-w-30 sm:max-w-none lg:max-w-35">
                          {team.name}
                        </span>
                        <span className="text-[0.6875rem] text-text-accent truncate max-w-30 sm:max-w-none lg:max-w-35">
                          {team.name}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`text-[0.6875rem] px-2 py-1 rounded-sm ${
                        team.status === "submitted"
                          ? "bg-[#2F251F] text-[#F19B14] border border-[#7D5323]"
                          : team.status === "checked"
                            ? "bg-[#0E1B18] text-[#28AF60] border border-[#1D5535]"
                            : "bg-text-accent/7 text-text-accent border border-border"
                      }`}
                    >
                      {team.status === "submitted"
                        ? "Ожидает"
                        : team.status === "checked"
                          ? "Оценено"
                          : "В работе"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </aside>

      <main className="flex flex-col py-6 px-4 md:px-10 overflow-y-auto bg-background flex-1">
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl text-white mb-1">Оценка решений</h1>
            <p className="text-xs text-text-accent">
              // Проверяйте технические задания хакатона и оценивайте пулы
              отправленных командами проектов.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-start gap-4 mb-4">
          <div className="flex gap-4 items-center w-full">
            <div className="h-12 w-12 bg-red/6 border border-red rounded-lg flex items-center justify-center shrink-0">
              <FileCheck className="w-6.5 h-6.5 text-red" />
            </div>
            <h3 className="text-base md:text-lg font-medium text-white leading-snug">
              {mockHackathon.task}
            </h3>
          </div>
        </div>

        <div className="flex bg-card-background border border-border p-1 rounded-lg w-full sm:w-fit mb-6 text-white text-xs">
          <button
            onClick={() => setActiveMainTab("spec")}
            className={`h-8 px-3 md:px-4 rounded-md transition-all flex items-center justify-center gap-2 flex-1 sm:flex-initial cursor-pointer ${
              activeMainTab === "spec"
                ? "bg-red text-white font-medium"
                : "text-text-accent hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">ТЗ</span>
          </button>
          <button
            onClick={() => setActiveMainTab("teams_review")}
            className={`h-8 px-3 md:px-4 rounded-md transition-all flex items-center justify-center gap-2 flex-1 sm:flex-initial cursor-pointer ${
              activeMainTab === "teams_review"
                ? "bg-red text-white font-medium"
                : "text-text-accent hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Проверка решений</span>
          </button>
        </div>

        <div className="flex-1">
          {activeMainTab === "spec" ? (
            <TaskSpecTab hackathon={mockHackathon} />
          ) : selectedTeamId ? (
            <EvaluationTab />
          ) : (
            <div className="border border-dashed border-border rounded-xl p-6 md:p-12 text-center bg-card-background/40 animate-fadeIn">
              <Users className="w-10 h-10 text-text-accent/40 mx-auto mb-3" />
              <h3 className="text-white text-sm font-medium mb-1">
                Команда не выбрана
              </h3>
              <p className="text-xs text-text-accent max-w-sm mx-auto leading-relaxed">
                {window.innerWidth < 1024
                  ? "Используйте кнопку «Команды» вверху панели жюри, чтобы открыть выпадающий список и выбрать проект для проверки."
                  : "Выберите нужную команду из списка слева, чтобы приступить к просмотру отправленных материалов и выставлению финальных оценок."}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
