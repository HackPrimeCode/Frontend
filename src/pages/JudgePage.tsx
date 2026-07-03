import { useState } from "react";
import { FileCheck, FileText, Users } from "lucide-react";
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

  return (
    <div className="w-full mx-auto min-h-[calc(100vh-3.75rem)] grid grid-cols-[260px_1fr]">
      <aside className="flex flex-col border-r border-border">
        <div className="w-full border-b border-border p-5">
          <span className="text-[10px] text-red uppercase font-semibold block mb-1 tracking-wider">
            Панель Жюри
          </span>
          <h2 className="text-white text-sm font-medium truncate">
            {mockHackathon.title}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-4">
          <div>
            <span className="text-xs text-text-accent uppercase block px-2 mb-6">
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
                        <span className="text-xs text-white truncate max-w-35">
                          {team.name}
                        </span>
                        <span className="text-[0.6875rem] text-text-accent truncate max-w-35">
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

      <main className="flex flex-col py-6 px-10 overflow-y-auto bg-background">
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl text-white mb-1">Оценка решений</h1>
            <p className="text-xs text-text-accent">
              // Проверяйте технические задания хакатона и оценивайте пулы
              отправленных командами проектов.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-start gap-4 mb-3">
          <div className="flex gap-4 h-14.5 items-center">
            <div className="h-12 w-12 bg-red/6 border border-red rounded-lg flex items-center justify-center">
              <FileCheck className="w-6.5 h-6.5 text-red" />
            </div>
            <h3 className="text-lg font-medium text-white">
              {mockHackathon.task}
            </h3>
          </div>
        </div>

        <div className="flex bg-card-background border border-border p-1 rounded-lg w-fit mb-6 text-white text-xs">
          <button
            onClick={() => setActiveMainTab("spec")}
            className={`h-8 px-4 rounded-md transition-all flex items-center gap-2 cursor-pointer ${
              activeMainTab === "spec"
                ? "bg-red text-white font-medium"
                : "text-text-accent hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Техническое задание</span>
          </button>
          <button
            onClick={() => setActiveMainTab("teams_review")}
            className={`h-8 px-4 rounded-md transition-all flex items-center gap-2 cursor-pointer ${
              activeMainTab === "teams_review"
                ? "bg-red text-white font-medium"
                : "text-text-accent hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Проверка решений команд</span>
          </button>
        </div>

        <div className="flex-1">
          {activeMainTab === "spec" ? (
            <TaskSpecTab hackathon={mockHackathon} />
          ) : selectedTeamId ? (
            <EvaluationTab />
          ) : (
            <div className="border border-dashed border-border rounded-xl p-12 text-center bg-card-background/40 animate-fadeIn">
              <Users className="w-10 h-10 text-text-accent/40 mx-auto mb-3" />
              <h3 className="text-white text-sm font-medium mb-1">
                Команда не выбрана
              </h3>
              <p className="text-xs text-text-accent max-w-sm mx-auto leading-relaxed">
                Выберите нужную команду из списка слева, чтобы приступить к
                просмотру отправленных материалов и выставлению финальных
                оценок.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
