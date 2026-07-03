import { useState } from "react";
import { FileText, Layers, CheckSquare, Trophy } from "lucide-react";
import TaskTab from "@/features/tasks/components/TaskTab/TaskTab";
import TrackerTab from "@/features/tasks/components/TrackerTab/TrackerTab";
import SubmissionTab from "@/features/tasks/components/SubmissionTab/SubmissionTab";

type SidebarTab = "task" | "tracker" | "submission";

export default function WorkTablePage() {
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>("task");

  const renderActiveTab = () => {
    switch (activeSidebarTab) {
      case "task":
        return <TaskTab />;
      case "tracker":
        return <TrackerTab />;
      case "submission":
        return <SubmissionTab />;
      default:
        return <TaskTab />;
    }
  };

  return (
    <div className="w-full mx-auto min-h-[calc(100vh-3.75rem)] flex flex-col lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="w-full flex flex-col lg:h-full border-b lg:border-b-0 lg:border-r border-border bg-background z-20">
        <div className="w-full border-b border-border p-4 lg:p-5 flex lg:flex-col justify-between items-center lg:items-start gap-2">
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs text-red uppercase block mb-0.5 lg:mb-2 tracking-wider">
              Мероприятие
            </span>
            <h2 className="text-white text-xs sm:text-sm font-medium truncate max-w-50 sm:max-w-xs lg:max-w-full">
              HackPrimeCode Лето 2026
            </h2>
          </div>
          <div className="lg:hidden p-1.5 bg-red/10 border border-red/20 rounded-md">
            <Trophy className="w-3.5 h-3.5 text-red" />
          </div>
        </div>

        <nav className="w-full flex lg:flex-col gap-1 p-2 overflow-x-auto custom-scrollbar whitespace-nowrap">
          <button
            onClick={() => setActiveSidebarTab("task")}
            className={`flex-1 lg:flex-none h-9 lg:h-10 px-3 rounded-lg flex items-center justify-center lg:justify-start gap-2 sm:gap-2.5 text-[11px] sm:text-xs font-medium lg:font-normal cursor-pointer transition-all shrink-0 ${
              activeSidebarTab === "task"
                ? "bg-red/6 border border-red text-red shadow-xs"
                : "text-text-accent hover:text-white hover:bg-input-background/50 border border-transparent"
            }`}
          >
            <FileText
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${activeSidebarTab === "task" ? "text-red" : ""}`}
            />
            <span>Задание</span>
          </button>

          <button
            onClick={() => setActiveSidebarTab("tracker")}
            className={`flex-1 lg:flex-none h-9 lg:h-10 px-3 rounded-lg flex items-center justify-center lg:justify-start gap-2 sm:gap-2.5 text-[11px] sm:text-xs font-medium lg:font-normal cursor-pointer transition-all shrink-0 ${
              activeSidebarTab === "tracker"
                ? "bg-red/6 border border-red text-red shadow-xs"
                : "text-text-accent hover:text-white hover:bg-input-background/50 border border-transparent"
            }`}
          >
            <Layers
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${activeSidebarTab === "tracker" ? "text-red" : ""}`}
            />
            <span>Таск-трекер</span>
          </button>

          <button
            onClick={() => setActiveSidebarTab("submission")}
            className={`flex-1 lg:flex-none h-9 lg:h-10 px-3 rounded-lg flex items-center justify-center lg:justify-start gap-2 sm:gap-2.5 text-[11px] sm:text-xs font-medium lg:font-normal cursor-pointer transition-all shrink-0 ${
              activeSidebarTab === "submission"
                ? "bg-red/6 border border-red text-red shadow-xs"
                : "text-text-accent hover:text-white hover:bg-input-background/50 border border-transparent"
            }`}
          >
            <CheckSquare
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${activeSidebarTab === "submission" ? "text-red" : ""}`}
            />
            <span>Сдача</span>
          </button>
        </nav>
      </aside>

      <main className="flex flex-col p-4 sm:p-6 min-w-0">
        <div className="mb-4 lg:mb-6">
          <h1 className="text-xl sm:text-2xl font-normal tracking-wide text-white mb-1">
            Рабочий стол
          </h1>
          <p className="text-[10px] sm:text-xs text-text-accent leading-relaxed">
            // Выполняйте задания, следите за прогрессом с помощью таск-трекера
          </p>
        </div>

        <div className="flex-1 min-h-0 w-full">{renderActiveTab()}</div>
      </main>
    </div>
  );
}
